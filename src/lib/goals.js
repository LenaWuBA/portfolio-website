export const GOALS_STORAGE_KEY = "learning-goals.v1";

export const TITLE_MAX_LENGTH = 120;
export const CATEGORY_MAX_LENGTH = 40;
export const NOTES_MAX_LENGTH = 500;

export const GOAL_CATEGORIES = [
  "Analytics",
  "Programming",
  "Data Visualization",
  "Machine Learning",
  "Career",
  "Other",
];

export function validateGoalFields(title, category, notes) {
  const errors = {};

  if (!title) {
    errors.title = "Please enter a goal title.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!category) {
    errors.category = "Please choose a category.";
  } else if (category.length > CATEGORY_MAX_LENGTH) {
    errors.category = `Category must be ${CATEGORY_MAX_LENGTH} characters or fewer.`;
  }

  if (notes.length > NOTES_MAX_LENGTH) {
    errors.notes = `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function generateId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createGoal(values) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: values.title,
    category: values.category,
    notes: values.notes,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeGoal(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) {
    return null;
  }

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : generateId(),
    title: title.slice(0, TITLE_MAX_LENGTH),
    category:
      typeof raw.category === "string"
        ? raw.category.trim().slice(0, CATEGORY_MAX_LENGTH)
        : "",
    notes:
      typeof raw.notes === "string"
        ? raw.notes.slice(0, NOTES_MAX_LENGTH)
        : "",
    completed: raw.completed === true,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
  };
}

export function parseStoredGoals(value) {
  if (value === null || value === undefined || value === "") {
    return { goals: [], corrupted: false };
  }

  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { goals: [], corrupted: true };
  }

  if (!Array.isArray(parsed)) {
    return { goals: [], corrupted: true };
  }

  const goals = parsed.map(normalizeGoal).filter(Boolean);
  return { goals, corrupted: goals.length < parsed.length };
}

const goalsListeners = new Set();
const SERVER_SNAPSHOT = Object.freeze({
  goals: null,
  corrupted: false,
  unavailable: true,
});
const CLIENT_UNAVAILABLE_SNAPSHOT = Object.freeze({
  goals: [],
  corrupted: false,
  unavailable: true,
});

export function subscribeToGoals(listener) {
  goalsListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    goalsListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

let snapshotCache = null;
let snapshotCacheKey = null;

export function getGoalsSnapshot() {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }

  if (!window.localStorage) {
    return CLIENT_UNAVAILABLE_SNAPSHOT;
  }

  let raw;
  try {
    raw = window.localStorage.getItem(GOALS_STORAGE_KEY);
  } catch {
    return CLIENT_UNAVAILABLE_SNAPSHOT;
  }

  if (snapshotCacheKey === raw && snapshotCache !== null) {
    return snapshotCache;
  }

  const parsed = parseStoredGoals(raw);
  snapshotCacheKey = raw;
  snapshotCache = Object.freeze({ ...parsed, unavailable: false });
  return snapshotCache;
}

export function getGoalsServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function saveGoals(goals) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch {
    return false;
  }

  goalsListeners.forEach((listener) => listener());
  return true;
}
