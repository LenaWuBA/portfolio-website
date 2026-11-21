import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  NAME_MAX_LENGTH,
  COMPANY_MAX_LENGTH,
  NOTES_MAX_LENGTH,
} from "./networking-constants";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const NETWORKING_FILE = path.join(DATA_DIRECTORY, "networking.json");

export function logApiRequest(method, endpoint, status) {
  console.log(`[networking-api] ${method} ${endpoint} -> ${status}`);
}

export async function readNetworkingContacts() {
  let content;
  try {
    content = await fs.readFile(NETWORKING_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error("Networking data file is not an array.");
  }
  return parsed;
}

export async function getNetworkingContactById(id) {
  const contacts = await readNetworkingContacts();
  return contacts.find((contact) => contact.id === id) ?? null;
}

export async function createNetworkingContact(values) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const contacts = await readNetworkingContacts();
  const now = new Date().toISOString();
  const contact = {
    id: randomUUID(),
    name: values.name.slice(0, NAME_MAX_LENGTH),
    company: values.company.slice(0, COMPANY_MAX_LENGTH),
    contactDate: values.contactDate,
    status: values.status,
    notes: values.notes.slice(0, NOTES_MAX_LENGTH),
    createdAt: now,
    updatedAt: now,
  };
  contacts.push(contact);
  await fs.writeFile(
    NETWORKING_FILE,
    JSON.stringify(contacts, null, 2),
    "utf8"
  );
  return contact;
}

export async function updateNetworkingContact(id, values) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const contacts = await readNetworkingContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const updated = {
    ...contacts[index],
    ...values,
    id,
    updatedAt: new Date().toISOString(),
  };
  contacts[index] = updated;
  await fs.writeFile(
    NETWORKING_FILE,
    JSON.stringify(contacts, null, 2),
    "utf8"
  );
  return updated;
}

export async function deleteNetworkingContact(id) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const contacts = await readNetworkingContacts();
  const next = contacts.filter((contact) => contact.id !== id);
  if (next.length === contacts.length) {
    return false;
  }
  await fs.writeFile(
    NETWORKING_FILE,
    JSON.stringify(next, null, 2),
    "utf8"
  );
  return true;
}
