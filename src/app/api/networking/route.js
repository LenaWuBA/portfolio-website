import { NextResponse } from "next/server";
import {
  createNetworkingContact,
  logApiRequest,
  readNetworkingContacts,
} from "@/lib/networking";
import {
  normalizeNetworkingValues,
  validateNetworkingFields,
} from "@/lib/networking-constants";

const ENDPOINT = "/api/networking";

function respond(method, status, payload) {
  logApiRequest(method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

export async function GET(request) {
  try {
    const contacts = await readNetworkingContacts();
    return respond(request.method, 200, {
      status: "success",
      contacts,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Networking contacts could not be read right now. Please try again later.",
      contacts: [],
      errors: {},
    });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return respond(request.method, 400, {
      status: "error",
      message: "Request body must be valid JSON.",
      errors: {},
    });
  }

  const values = normalizeNetworkingValues(body);
  const errors = validateNetworkingFields(
    values.name,
    values.company,
    values.contactDate,
    values.status,
    values.notes
  );
  if (Object.keys(errors).length > 0) {
    return respond(request.method, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const contact = await createNetworkingContact(values);
    return respond(request.method, 201, {
      status: "success",
      message: "Networking contact created successfully.",
      contact,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the networking contact could not be saved right now. Please try again later.",
      errors: {},
    });
  }
}
