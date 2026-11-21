import { NextResponse } from "next/server";
import {
  saveContactSubmission,
  validateContactFields,
} from "@/lib/contact";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/contact";

function respond(method, status, payload) {
  logApiRequest("contacts", method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
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

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  const errors = validateContactFields(name, email, message);
  if (Object.keys(errors).length > 0) {
    return respond(request.method, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    await saveContactSubmission({ name, email, message });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, your message could not be saved right now. Please try again later.",
      errors: {},
    });
  }

  return respond(request.method, 201, {
    status: "success",
    message: "Thank you! Your message has been received.",
  });
}
