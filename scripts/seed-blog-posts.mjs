import { readFile } from "node:fs/promises";
import path from "node:path";
import { saveBlogPost } from "../src/lib/blogs.js";

const DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json");

const samplePosts = [
  {
    title: "From Key Accounts to Key Insights",
    content: `After 11 years in enterprise B2B business development and key account management, I have seen how much commercial success depends on judgment: reading a client's priorities, sensing when a partnership is ready to grow, and knowing which conversations matter most.

What I have also seen is how often that judgment runs on incomplete information. Account plans built on anecdotes, forecasts shaped by the loudest opinion in the room, and reporting that describes the past without explaining it.

That gap is why I am studying business analytics. Python, SQL, Power BI, Tableau, and machine learning are turning the instincts I developed managing key accounts into repeatable, data-driven decisions, and this portfolio is where I share that work.`,
  },
  {
    title: "Learning Business Analytics at Santa Clara University",
    content: `I am currently pursuing a Master of Science in Business Analytics at Santa Clara University, and this post collects what the program is teaching me so far.

The technical foundations come first: writing Python and SQL to prepare and query data, building dashboards in Power BI and Tableau, and learning how machine learning models make predictions and where they fail.

The more interesting lessons are about translation. The program keeps pushing me to connect an analysis back to a business decision, which maps directly onto my enterprise B2B background: the questions I used to answer with experience alone, I can now answer with evidence.`,
  },
];

async function main() {
  let existing = [];
  try {
    const content = await readFile(DATA_FILE, "utf8");
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
      `Blog data already contains ${existing.length} post(s); seed skipped.`
    );
    return;
  }

  for (const sample of samplePosts) {
    const created = await saveBlogPost(sample.title, sample.content);
    console.log(`Seeded: ${created.title} -> /blogs/${created.slug}`);
  }
  console.log(
    "Sample blog posts created. Run npm run dev and open http://localhost:3000/blogs"
  );
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
