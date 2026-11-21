import { NextResponse } from "next/server";
import {
  readContactSubmissions,
} from "@/lib/contact";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/contacts";

function respond(method, status, payload) {
  logApiRequest("contacts", method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

export { POST } from "../contact/route";

export async function GET(request) {
  try {
    const submissions = await readContactSubmissions();
    return respond(request.method, 200, {
      status: "success",
      submissions,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Contact submissions could not be read right now. Please try again later.",
      submissions: [],
      errors: {},
    });
  }
}
