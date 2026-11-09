import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        My Projects
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        A selection of projects combining business context with analytical
        work. Each project page describes the problem, the approach, and what
        the work involved.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {project.title}
            </h2>
            <p className="mt-3 flex-1 leading-7 text-slate-600">
              {project.summary}
            </p>
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
            <Link
              href={`/projects/${project.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
            >
              View project details
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
