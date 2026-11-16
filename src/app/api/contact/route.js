import { NextResponse } from "next/server";
import {
  saveContactSubmission,
  validateContactFields,
} from "@/lib/contact";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Request body must be valid JSON.",
        errors: {},
      },
      { status: 400 }
    );
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  const errors = validateContactFields(name, email, message);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        status: "error",
        message: "Please fix the highlighted fields and try again.",
        errors,
      },
      { status: 400 }
    );
  }

  try {
    await saveContactSubmission({ name, email, message });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Sorry, your message could not be saved right now. Please try again later.",
        errors: {},
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { status: "success", message: "Thank you! Your message has been received." },
    { status: 201 }
  );
}
