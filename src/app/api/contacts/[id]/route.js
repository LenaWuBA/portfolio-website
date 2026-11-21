import { NextResponse } from "next/server";
import {
  deleteContactSubmission,
  getContactSubmissionById,
  updateContactSubmission,
  validateContactFields,
} from "@/lib/contact";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/contacts/:id";

function respond(method, status, payload) {
  logApiRequest("contacts", method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

function notFoundResponse(method) {
  return respond(method, 404, {
    status: "error",
    message: "Contact submission not found.",
    errors: {},
  });
}

function invalidBodyResponse(method) {
  return respond(method, 400, {
    status: "error",
    message: "Request body must be valid JSON.",
    errors: {},
  });
}

function validationErrorResponse(method, errors) {
  return respond(method, 400, {
    status: "error",
    message: "Please fix the highlighted fields and try again.",
    errors,
  });
}

function normalizeValues(body) {
  return {
    name: String(body?.name ?? "").trim(),
    email: String(body?.email ?? "").trim(),
    message: String(body?.message ?? "").trim(),
  };
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid submission id is required.",
      errors: {},
    });
  }

  try {
    const submission = await getContactSubmissionById(id);
    if (!submission) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      submission,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Contact submission could not be read right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid submission id is required.",
      errors: {},
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return invalidBodyResponse(request.method);
  }

  const values = normalizeValues(body);
  const errors = validateContactFields(values.name, values.email, values.message);
  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(request.method, errors);
  }

  try {
    const submission = await updateContactSubmission(id, values);
    if (!submission) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      message: "Contact submission updated successfully.",
      submission,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the contact submission could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid submission id is required.",
      errors: {},
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return invalidBodyResponse(request.method);
  }

  try {
    const existing = await getContactSubmissionById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }

    const merged = normalizeValues({
      name: body?.name ?? existing.name,
      email: body?.email ?? existing.email,
      message: body?.message ?? existing.message,
    });

    const errors = validateContactFields(merged.name, merged.email, merged.message);
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(request.method, errors);
    }

    const submission = await updateContactSubmission(id, merged);
    return respond(request.method, 200, {
      status: "success",
      message: "Contact submission updated successfully.",
      submission,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the contact submission could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid submission id is required.",
      errors: {},
    });
  }

  try {
    const deleted = await deleteContactSubmission(id);
    if (!deleted) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      message: "Contact submission deleted successfully.",
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the contact submission could not be deleted right now. Please try again later.",
      errors: {},
    });
  }
}
