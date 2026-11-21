import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export {
  TITLE_MAX_LENGTH,
  CONTENT_MAX_LENGTH,
  validateBlogFields,
} from "./blog-constants";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const BLOG_FILE = path.join(DATA_DIRECTORY, "blog-posts.json");

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

export async function getBlogPostById(id) {
  const posts = await readBlogPosts();
  return posts.find((post) => post.id === id) ?? null;
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

export async function updateBlogPost(id, values) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const posts = await readBlogPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return null;
  }

  const existing = posts[index];
  const title = values.title ?? existing.title;
  const content = values.content ?? existing.content;

  const slugChanged = title !== existing.title;
  const slug = slugChanged
    ? generateSlug(
        title,
        new Set(
          posts.filter((post) => post.id !== id).map((post) => post.slug)
        )
      )
    : existing.slug;

  const updated = {
    ...existing,
    title,
    content,
    slug,
    createdAt: existing.createdAt,
  };
  posts[index] = updated;
  await fs.writeFile(BLOG_FILE, JSON.stringify(posts, null, 2), "utf8");
  return updated;
}

export async function deleteBlogPost(id) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  const posts = await readBlogPosts();
  const next = posts.filter((post) => post.id !== id);
  if (next.length === posts.length) {
    return false;
  }
  await fs.writeFile(BLOG_FILE, JSON.stringify(next, null, 2), "utf8");
  return true;
}
