import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
  validateBlogFields,
} from "@/lib/blogs";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/blogs/:id";

function respond(method, status, payload) {
  logApiRequest("blogs", method, ENDPOINT, status);
  return NextResponse.json(payload, { status });
}

function revalidateBlogPaths(...slugs) {
  try {
    revalidatePath("/blogs");
    for (const slug of slugs) {
      if (slug) {
        revalidatePath(`/blogs/${slug}`);
      }
    }
  } catch {
    // cache purging is best effort; data is already persisted
  }
}

function notFoundResponse(method) {
  return respond(method, 404, {
    status: "error",
    message: "Blog post not found.",
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
      message: "A valid post id is required.",
      errors: {},
    });
  }

  try {
    const post = await getBlogPostById(id);
    if (!post) {
      return notFoundResponse(request.method);
    }
    return respond(request.method, 200, {
      status: "success",
      post,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Blog post could not be read right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid post id is required.",
      errors: {},
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return invalidBodyResponse(request.method);
  }

  const title = String(body?.title ?? "").trim();
  const content = String(body?.content ?? "").trim();

  const errors = validateBlogFields(title, content);
  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(request.method, errors);
  }

  try {
    const existing = await getBlogPostById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }
    const post = await updateBlogPost(id, { title, content });
    if (!post) {
      return notFoundResponse(request.method);
    }
    revalidateBlogPaths(existing.slug, post.slug);
    return respond(request.method, 200, {
      status: "success",
      message: "Blog post updated successfully.",
      post,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the blog post could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid post id is required.",
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
    const existing = await getBlogPostById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }

    const title =
      body?.title === undefined
        ? existing.title
        : String(body.title).trim();
    const content =
      body?.content === undefined
        ? existing.content
        : String(body.content).trim();

    const errors = validateBlogFields(title, content);
    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(request.method, errors);
    }

    const post = await updateBlogPost(id, { title, content });
    revalidateBlogPaths(existing.slug, post?.slug ?? existing.slug);
    return respond(request.method, 200, {
      status: "success",
      message: "Blog post updated successfully.",
      post,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the blog post could not be updated right now. Please try again later.",
      errors: {},
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!id) {
    return respond(request.method, 400, {
      status: "error",
      message: "A valid post id is required.",
      errors: {},
    });
  }

  try {
    const existing = await getBlogPostById(id);
    if (!existing) {
      return notFoundResponse(request.method);
    }
    const deleted = await deleteBlogPost(id);
    if (!deleted) {
      return notFoundResponse(request.method);
    }
    revalidateBlogPaths(existing.slug);
    return respond(request.method, 200, {
      status: "success",
      message: "Blog post deleted successfully.",
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the blog post could not be deleted right now. Please try again later.",
      errors: {},
    });
  }
}
