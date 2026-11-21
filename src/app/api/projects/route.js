import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  createProject,
  normalizeProjectValues,
  readProjects,
  validateProjectFields,
} from "@/lib/projects";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/projects";

function respond(method, status, payload) {
  logApiRequest("projects", method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

function revalidateProjectPaths() {
  try {
    revalidatePath("/projects");
  } catch {
    // cache purging is best effort; data is already persisted
  }
}

export async function GET(request) {
  try {
    const projects = await readProjects();
    return respond(request.method, 200, {
      status: "success",
      projects,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Projects could not be read right now. Please try again later.",
      projects: [],
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

  const values = normalizeProjectValues(body);
  const errors = validateProjectFields(values);
  if (Object.keys(errors).length > 0) {
    return respond(request.method, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const project = await createProject(values);
    revalidateProjectPaths();
    return respond(request.method, 201, {
      status: "success",
      message: "Project created successfully.",
      project,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the project could not be saved right now. Please try again later.",
      errors: {},
    });
  }
}
