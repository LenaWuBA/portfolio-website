import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  deleteProject,
  getProjectById,
  normalizeProjectValues,
  updateProject,
  validateProjectFields,
} from "@/lib/projects";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/projects/:id";

function respond(method, status, payload) {
  logApiRequest("projects", method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

function revalidateProjectPaths(...slugs) {
  try {
    revalidatePath("/projects");
    for (const slug of slugs) {
      if (slug) {
        revalidatePath(`/projects/${slug}`);
      }
    }
  } catch {
    // cache purging is best effort; data is already persisted
  }
}

function notFoundResponse(method) {
  return respond(method, 404, {
    status: "error",
    message: "Project not found.",
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
    return respond(request.method, 400, {
      status: "error",
      message: "A valid project id is required.",
      errors: {},
    });
  }

  try {
    const project = await getProjectById(id);
    if (!project) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      project,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Project could not be read right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid project id is required.",
      errors: {},
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return invalidBodyResponse(request.method);
  }

  const values = normalizeProjectValues(body);
  const errors = validateProjectFields(values);
  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(request.method, errors);
  }

  try {
    const existing = await getProjectById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }
    const project = await updateProject(id, values);
    if (!project) {
      return notFoundResponse(request.method);
    }
    revalidateProjectPaths(existing.slug, project.slug);
    return respond(request.method, 200, {
      status: "success",
      message: "Project updated successfully.",
      project,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the project could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid project id is required.",
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
    const existing = await getProjectById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }

    const provided = normalizeProjectValues({
      title: body?.title ?? existing.title,
      summary: body?.summary ?? existing.summary,
      technologies: body?.technologies ?? existing.technologies,
      overview: body?.overview ?? existing.overview,
      highlights: body?.highlights ?? existing.highlights,
    });

    const errors = validateProjectFields(provided);
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(request.method, errors);
    }

    const project = await updateProject(id, provided);
    revalidateProjectPaths(existing.slug, project?.slug ?? existing.slug);
    return respond(request.method, 200, {
      status: "success",
      message: "Project updated successfully.",
      project,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the project could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid project id is required.",
      errors: {},
    });
  }

  try {
    const existing = await getProjectById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }
    const deleted = await deleteProject(id);
    if (!deleted) {
      return notFoundResponse(request.method);
    }
    revalidateProjectPaths(existing.slug);
    return respond(request.method, 200, {
      status: "success",
      message: "Project deleted successfully.",
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the project could not be deleted right now. Please try again later.",
      errors: {},
    });
  }
}
