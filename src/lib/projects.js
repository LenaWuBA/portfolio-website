import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIRECTORY, "projects.json");
export const TITLE_MAX_LENGTH = 150;
export const SUMMARY_MAX_LENGTH = 500;
export const TEXT_MAX_LENGTH = 2000;
export const ITEM_MAX_LENGTH = 200;

export function validateProjectFields(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Please enter a project title.";
  } else if (values.title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!values.summary) {
    errors.summary = "Please enter a short summary.";
  } else if (values.summary.length > SUMMARY_MAX_LENGTH) {
    errors.summary = `Summary must be ${SUMMARY_MAX_LENGTH} characters or fewer.`;
  }

  if (!Array.isArray(values.technologies) || values.technologies.length === 0) {
    errors.technologies = "Please add at least one technology.";
  }

  if (!Array.isArray(values.overview) || values.overview.length === 0) {
    errors.overview = "Please add at least one overview paragraph.";
  }

  if (!Array.isArray(values.highlights) || values.highlights.length === 0) {
    errors.highlights = "Please add at least one highlight.";
  }

  return errors;
}

export function normalizeProjectValues(body) {
  return {
    title: String(body?.title ?? "").trim(),
    summary: String(body?.summary ?? "").trim(),
    technologies: Array.isArray(body?.technologies)
      ? body.technologies
          .map((item) => String(item).trim().slice(0, ITEM_MAX_LENGTH))
          .filter(Boolean)
      : [],
    overview: Array.isArray(body?.overview)
      ? body.overview
          .map((item) => String(item).trim().slice(0, TEXT_MAX_LENGTH))
          .filter(Boolean)
      : [],
    highlights: Array.isArray(body?.highlights)
      ? body.highlights
          .map((item) => String(item).trim().slice(0, ITEM_MAX_LENGTH))
          .filter(Boolean)
      : [],
  };
}

function generateSlug(title, existingSlugs) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fallback = base || "project";
  let candidate = fallback;
  let counter = 2;
  while (existingSlugs.has(candidate)) {
    candidate = `${fallback}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export async function readProjects() {
  let content;
  try {
    content = await fs.readFile(PROJECTS_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error("Projects data file is not an array.");
  }
  return parsed;
}

export async function getProjectBySlug(slug) {
  const projects = await readProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getProjectById(id) {
  const projects = await readProjects();
  return projects.find((project) => project.id === id) ?? null;
}

export async function createProject(values) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const projects = await readProjects();
  const now = new Date().toISOString();
  const project = {
    id: randomUUID(),
    slug: generateSlug(
      values.title,
      new Set(projects.map((project) => project.slug))
    ),
    title: values.title.slice(0, TITLE_MAX_LENGTH),
    summary: values.summary.slice(0, SUMMARY_MAX_LENGTH),
    technologies: values.technologies,
    overview: values.overview,
    highlights: values.highlights,
    createdAt: now,
    updatedAt: now,
  };
  projects.push(project);
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8");
  return project;
}

export async function updateProject(id, values) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const projects = await readProjects();
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) {
    return null;
  }

  const updated = {
    ...projects[index],
    ...values,
    id,
    slug: projects[index].slug,
    createdAt: projects[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8");
  return updated;
}

export async function deleteProject(id) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const projects = await readProjects();
  const next = projects.filter((project) => project.id !== id);
  if (next.length === projects.length) {
    return false;
  }
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(next, null, 2), "utf8");
  return true;
}
