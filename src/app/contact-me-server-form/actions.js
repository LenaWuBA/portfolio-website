"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "contact-submissions.json");
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(previousState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors = collectValidationErrors(name, email, message);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  try {
    await saveSubmission({ name, email, message });
  } catch {
    return {
      status: "error",
      message:
        "Sorry, your message could not be saved right now. Please try again later.",
      errors: {},
    };
  }

  return {
    status: "success",
    message: "Thank you! Your message has been received.",
    errors: {},
  };
}

function collectValidationErrors(name, email, message) {
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
  } else if (!EMAIL_PATTERN.test(email)) {
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

async function readSubmissions() {
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

async function saveSubmission(submission) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const submissions = await readSubmissions();
  submissions.push({
    id: randomUUID(),
    ...submission,
    submittedAt: new Date().toISOString(),
  });
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
}
