"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatusBanner from "@/components/shared/StatusBanner";
import {
  errorInputClasses,
  inputClasses,
} from "@/components/goals/FieldError";
import ProjectForm from "@/components/admin/ProjectForm";

const initialFeedback = { status: "idle", message: "" };

async function fetchProjects() {
  try {
    const response = await fetch("/api/projects");
    const data = await response.json().catch(() => null);
    if (response.ok && data?.status === "success") {
      return { projects: data.projects, error: "" };
    }
    return {
      projects: null,
      error: data?.message ?? "Projects could not be loaded right now.",
    };
  } catch {
    return {
      projects: null,
      error: "Network error: could not load projects.",
    };
  }
}

export default function ProjectAdmin() {
  const [projects, setProjects] = useState(null);
  const [listError, setListError] = useState("");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let active = true;
    fetchProjects().then((result) => {
      if (!active) return;
      setProjects(result.projects);
      setListError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(values) {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => null);

      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
        });
        return { ok: false, errors: {} };
      }

      if (response.status === 201 && data.status === "success") {
        setProjects((current) => [...(current ?? []), data.project]);
        setFeedback({
          status: "success",
          message: `Project "${data.project.title}" created at /projects/${data.project.slug}.`,
        });
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message: data.message ?? "Sorry, the project could not be saved.",
      });
      return { ok: false, errors: data.errors ?? {} };
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
      });
      return { ok: false, errors: {} };
    }
  }

  async function handleUpdate(id, values) {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => null);

      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
        });
        return { ok: false, errors: {} };
      }

      if (response.ok && data.status === "success") {
        setProjects((current) =>
          (current ?? []).map((project) =>
            project.id === id ? data.project : project
          )
        );
        setEditingId(null);
        setFeedback({
          status: "success",
          message: `Project "${data.project.title}" updated.`,
        });
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message: data.message ?? "Sorry, the project could not be updated.",
      });
      return { ok: false, errors: data.errors ?? {} };
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
      });
      return { ok: false, errors: {} };
    }
  }

  async function handleDelete(id) {
    const target = (projects ?? []).find((project) => project.id === id);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
        });
        return;
      }

      if (response.ok && data.status === "success") {
        setProjects((current) =>
          (current ?? []).filter((project) => project.id !== id)
        );
        if (editingId === id) {
          setEditingId(null);
        }
        setFeedback({
          status: "success",
          message: target
            ? `Project "${target.title}" deleted.`
            : "Project deleted.",
        });
        return;
      }

      setFeedback({
        status: "error",
        message: data.message ?? "Sorry, the project could not be deleted.",
      });
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
      });
    }
  }

  if (projects === null) {
    return (
      <p role="status" className="mt-10 text-sm text-slate-500">
        Loading projects...
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-2">
      <section aria-labelledby="add-project-heading">
        <h2
          id="add-project-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Add a project
        </h2>
        <div className="mt-4">
          <StatusBanner status={feedback.status} message={feedback.message} />
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProjectForm submitLabel="Create Project" onSubmit={handleCreate} />
          </div>
        </div>
      </section>

      <section aria-labelledby="existing-projects-heading">
        <h2
          id="existing-projects-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Existing Projects
        </h2>
        {listError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {listError}
          </p>
        )}
        {!listError && projects.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">
            No projects yet. Create your first project with the form.
          </p>
        )}
        {!listError && projects.length > 0 && (
          <ul className="mt-4 space-y-4">
            {projects.map((project) =>
              editingId === project.id ? (
                <li
                  key={project.id}
                  className="rounded-xl border border-blue-200 bg-blue-50/40 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Editing project
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Public URL stays /projects/{project.slug}
                  </p>
                  <div className="mt-4">
                    <ProjectForm
                      key={project.id}
                      initialProject={project}
                      submitLabel="Save Changes"
                      onSubmit={(values) => handleUpdate(project.id, values)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                </li>
              ) : (
                <li
                  key={project.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    /projects/{project.slug}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {project.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(project.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      aria-label={`Delete project: ${project.title}`}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
