import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const BLOG_FILE = path.join(DATA_DIRECTORY, "blog-posts.json");
const TITLE_MAX_LENGTH = 150;
const CONTENT_MAX_LENGTH = 20000;

export function validateBlogFields(title, content) {
  const errors = {};

  if (!title) {
    errors.title = "Please enter a title.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!content) {
    errors.content = "Please enter some content.";
  } else if (content.length > CONTENT_MAX_LENGTH) {
    errors.content = `Content must be ${CONTENT_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

function generateSlug(title, existingSlugs) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fallback = base || "post";
  let candidate = fallback;
  let counter = 2;
  while (existingSlugs.has(candidate)) {
    candidate = `${fallback}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export async function readBlogPosts() {
  let content;
  try {
    content = await fs.readFile(BLOG_FILE, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error("Blog posts file is not an array.");
  }
  return parsed;
}

export async function getBlogPostBySlug(slug) {
  const posts = await readBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function saveBlogPost(title, content) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const posts = await readBlogPosts();
  const slug = generateSlug(title, new Set(posts.map((post) => post.slug)));
  const post = {
    id: randomUUID(),
    title,
    content,
    slug,
    createdAt: new Date().toISOString(),
  };
  posts.push(post);
  await fs.writeFile(BLOG_FILE, JSON.stringify(posts, null, 2), "utf8");
  return post;
}
