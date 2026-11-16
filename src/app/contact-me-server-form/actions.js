"use server";

import {
  saveContactSubmission,
  validateContactFields,
} from "@/lib/contact";

export async function submitContact(previousState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors = validateContactFields(name, email, message);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  try {
    await saveContactSubmission({ name, email, message });
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
