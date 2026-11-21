import { NextResponse } from "next/server";
import {
  deleteNetworkingContact,
  getNetworkingContactById,
  logApiRequest,
  updateNetworkingContact,
} from "@/lib/networking";
import {
  normalizeNetworkingValues,
  validateNetworkingFields,
} from "@/lib/networking-constants";

const ENDPOINT = "/api/networking/:id";

function respond(method, status, payload) {
  logApiRequest(method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

function invalidIdResponse(method) {
  return respond(method, 400, {
    status: "error",
    message: "A valid contact id is required.",
    errors: {},
  });
}

function notFoundResponse(method) {
  return respond(method, 404, {
    status: "error",
    message: "Networking contact not found.",
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

export async function GET(request, { params }) {
  const { id } = await params;
  if (!id) {
    return invalidIdResponse(request.method);
  }

  try {
    const contact = await getNetworkingContactById(id);
    if (!contact) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      contact,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Networking contact could not be read right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  if (!id) {
    return invalidIdResponse(request.method);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return invalidBodyResponse(request.method);
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
    return validationErrorResponse(request.method, errors);
  }

  try {
    const contact = await updateNetworkingContact(id, values);
    if (!contact) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      message: "Networking contact updated successfully.",
      contact,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the networking contact could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!id) {
    return invalidIdResponse(request.method);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return invalidBodyResponse(request.method);
  }

  try {
    const existing = await getNetworkingContactById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }

    const merged = normalizeNetworkingValues({
      name: body?.name ?? existing.name,
      company: body?.company ?? existing.company,
      contactDate: body?.contactDate ?? existing.contactDate,
      status: body?.status ?? existing.status,
      notes: body?.notes ?? existing.notes,
    });

    const errors = validateNetworkingFields(
      merged.name,
      merged.company,
      merged.contactDate,
      merged.status,
      merged.notes
    );
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(request.method, errors);
    }

    const contact = await updateNetworkingContact(id, merged);
    return respond(request.method, 200, {
      status: "success",
      message: "Networking contact updated successfully.",
      contact,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the networking contact could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!id) {
    return invalidIdResponse(request.method);
  }

  try {
    const deleted = await deleteNetworkingContact(id);
    if (!deleted) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      message: "Networking contact deleted successfully.",
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the networking contact could not be deleted right now. Please try again later.",
      errors: {},
    });
  }
}
