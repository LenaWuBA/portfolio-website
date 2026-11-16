import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "contact-submissions.json");
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 2000;

export function isValidEmail(email) {
  if (/\s/.test(email)) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [localPart, domain] = parts;
  if (!localPart) return false;
  const labels = domain.split(".");
  if (labels.length < 2) return false;
  return labels.every((label) => label.length > 0);
}

export function validateContactFields(name, email, message) {
  const errors = {};

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > EMAIL_MAX_LENGTH) {
    errors.email = `Email must be ${EMAIL_MAX_LENGTH} characters or fewer.`;
  } else if (!isValidEmail(email)) {
    errors.email =
      "Please enter a valid email address, for example name@example.com.";
  }

  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export async function readContactSubmissions() {
  let content;
  try {
    content = await fs.readFile(DATA_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error("Contact submissions file is not an array.");
  }
  return parsed;
}

export async function saveContactSubmission(submission) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const submissions = await readContactSubmissions();
  submissions.push({
    id: randomUUID(),
    ...submission,
    submittedAt: new Date().toISOString(),
  });
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
}
