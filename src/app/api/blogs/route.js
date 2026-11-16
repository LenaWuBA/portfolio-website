import { NextResponse } from "next/server";
import {
  readBlogPosts,
  saveBlogPost,
  validateBlogFields,
} from "@/lib/blogs";

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

  const title = String(body?.title ?? "").trim();
  const content = String(body?.content ?? "").trim();

  const errors = validateBlogFields(title, content);
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
    const post = await saveBlogPost(title, content);
    return NextResponse.json(
      {
        status: "success",
        message: "Blog post published successfully.",
        post,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Sorry, the blog post could not be saved right now. Please try again later.",
        errors: {},
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await readBlogPosts();
    return NextResponse.json({ status: "success", posts }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Blog posts could not be read right now. Please try again later.",
        posts: [],
      },
      { status: 500 }
    );
  }
}
