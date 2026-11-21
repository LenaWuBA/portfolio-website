import { NextResponse } from "next/server";
import {
  readBlogPosts,
  saveBlogPost,
  validateBlogFields,
} from "@/lib/blogs";
import { logApiRequest } from "@/lib/api-logger";

const ENDPOINT = "/api/blogs";

function respond(method, status, payload) {
  logApiRequest("blogs", method, ENDPOINT, status);
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

  const title = String(body?.title ?? "").trim();
  const content = String(body?.content ?? "").trim();

  const errors = validateBlogFields(title, content);
  if (Object.keys(errors).length > 0) {
    return respond(request.method, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const post = await saveBlogPost(title, content);
    return respond(request.method, 201, {
      status: "success",
      message: "Blog post published successfully.",
      post,
    });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Sorry, the blog post could not be saved right now. Please try again later.",
      errors: {},
    });
  }
}

export async function GET(request) {
  try {
    const posts = await readBlogPosts();
    return respond(request.method, 200, { status: "success", posts });
  } catch {
    return respond(request.method, 500, {
      status: "error",
      message:
        "Blog posts could not be read right now. Please try again later.",
      posts: [],
    });
  }
}
