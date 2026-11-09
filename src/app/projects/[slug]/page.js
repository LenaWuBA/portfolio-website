import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
      >
        <span aria-hidden="true">←</span> Back to Projects
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {project.title}
      </h1>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
        {project.technologies.map((technology) => (
          <li
            key={technology}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {technology}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {project.overview.map((paragraph) => (
          <p key={paragraph} className="mt-3 leading-7 text-slate-600">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="highlights-heading">
        <h2 id="highlights-heading" className="text-xl font-semibold text-slate-900">
          Project Highlights
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-600">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
