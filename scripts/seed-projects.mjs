import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { projects } from "../src/data/projects.js";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIRECTORY, "projects.json");

function generateSlug(title, existingSlugs) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fallback = base || "project";
  let candidate = fallback;
  let counter = 2;
  while (existingSlugs.has(candidate)) {
    candidate = `${fallback}-${counter}`;
    counter += 1;
  }
  return candidate;
}

async function main() {
  let existing = [];
  try {
    const content = await readFile(PROJECTS_FILE, "utf8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      existing = parsed;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  if (existing.length > 0) {
    console.log(
      `projects.json already exists with ${existing.length} record(s). Nothing migrated.`
    );
    return;
  }

  const slugs = new Set(existing.map((project) => project.slug));
  const now = new Date().toISOString();
  const migrated = projects.map((project) => {
    const slug =
      project.slug ??
      generateSlug(project.title, slugs);
    slugs.add(slug);
    return {
      id: randomUUID(),
      slug,
      title: project.title,
      summary: project.summary,
      technologies: project.technologies,
      overview: project.overview,
      highlights: project.highlights,
      createdAt: now,
      updatedAt: now,
    };
  });

  await mkdir(DATA_DIRECTORY, { recursive: true });
  await writeFile(
    PROJECTS_FILE,
    JSON.stringify(migrated, null, 2),
    "utf8"
  );
  console.log(
    `Migrated ${migrated.length} project record(s) from src/data/projects.js to data/projects.json:`
  );
  migrated.forEach((project) => {
    console.log(`  - ${project.slug} (id ${project.id})`);
  });
}

main();
