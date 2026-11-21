"use client";

import { useState } from "react";
import { errorInputClasses, inputClasses } from "@/components/goals/FieldError";

function toTextareaValue(list) {
  return (list ?? []).join("\n");
}

function parseLines(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseParagraphs(value) {
  return String(value ?? "")
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function ProjectForm({
  initialProject = null,
  submitLabel,
  onSubmit,
  onCancel = null,
}) {
  const isEditing = Boolean(initialProject);
  const idPrefix = isEditing ? "edit-project" : "new-project";
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const values = {
      title: String(formData.get("title") ?? "").trim(),
      summary: String(formData.get("summary") ?? "").trim(),
      technologies: String(formData.get("technologies") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      overview: parseParagraphs(formData.get("overview")),
      highlights: parseLines(formData.get("highlights")),
    };

    const localErrors = {};
    if (!values.title) localErrors.title = "Please enter a project title.";
    if (!values.summary) localErrors.summary = "Please enter a short summary.";
    if (values.technologies.length === 0) {
      localErrors.technologies = "Please add at least one technology.";
    }
    if (values.overview.length === 0) {
      localErrors.overview = "Please add at least one overview paragraph.";
    }
    if (values.highlights.length === 0) {
      localErrors.highlights = "Please add at least one highlight.";
    }
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    const result = (await onSubmit(values)) ?? { ok: false, errors: {} };
    setIsSaving(false);

    if (result.ok) {
      setErrors({});
      if (!isEditing) {
        form.reset();
      }
    } else {
      setErrors(result.errors ?? {});
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor={`${idPrefix}-title`}
          className="block text-sm font-semibold text-slate-900"
        >
          Title <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          type="text"
          id={`${idPrefix}-title`}
          name="title"
          defaultValue={initialProject?.title ?? ""}
          required
          aria-required="true"
          aria-invalid={errors.title ? "true" : undefined}
          aria-describedby={errors.title ? `${idPrefix}-title-error` : undefined}
          className={errors.title ? errorInputClasses : inputClasses}
        />
        {errors.title && (
          <p id={`${idPrefix}-title-error`} className="mt-2 text-sm text-red-700">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-summary`}
          className="block text-sm font-semibold text-slate-900"
        >
          Summary <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id={`${idPrefix}-summary`}
          name="summary"
          rows={2}
          defaultValue={initialProject?.summary ?? ""}
          required
          aria-required="true"
          aria-invalid={errors.summary ? "true" : undefined}
          aria-describedby={errors.summary ? `${idPrefix}-summary-error` : undefined}
          className={errors.summary ? errorInputClasses : inputClasses}
        />
        {errors.summary && (
          <p id={`${idPrefix}-summary-error`} className="mt-2 text-sm text-red-700">
            {errors.summary}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-technologies`}
          className="block text-sm font-semibold text-slate-900"
        >
          Technologies <span aria-hidden="true">*</span>
          <span className="sr-only">(required, comma separated)</span>
        </label>
        <input
          type="text"
          id={`${idPrefix}-technologies`}
          name="technologies"
          defaultValue={(initialProject?.technologies ?? []).join(", ")}
          placeholder="Python, SQL, Power BI"
          required
          aria-required="true"
          aria-invalid={errors.technologies ? "true" : undefined}
          aria-describedby={
            errors.technologies ? `${idPrefix}-technologies-error` : undefined
          }
          className={errors.technologies ? errorInputClasses : inputClasses}
        />
        {errors.technologies && (
          <p id={`${idPrefix}-technologies-error`} className="mt-2 text-sm text-red-700">
            {errors.technologies}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-overview`}
          className="block text-sm font-semibold text-slate-900"
        >
          Overview <span aria-hidden="true">*</span>
          <span className="sr-only">(required, separate paragraphs with a blank line)</span>
        </label>
        <textarea
          id={`${idPrefix}-overview`}
          name="overview"
          rows={5}
          defaultValue={(initialProject?.overview ?? []).join("\n\n")}
          required
          aria-required="true"
          aria-invalid={errors.overview ? "true" : undefined}
          aria-describedby={errors.overview ? `${idPrefix}-overview-error` : undefined}
          className={errors.overview ? errorInputClasses : inputClasses}
        />
        <p className="mt-1 text-xs text-slate-500">
          Separate paragraphs with a blank line.
        </p>
        {errors.overview && (
          <p id={`${idPrefix}-overview-error`} className="mt-2 text-sm text-red-700">
            {errors.overview}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-highlights`}
          className="block text-sm font-semibold text-slate-900"
        >
          Highlights <span aria-hidden="true">*</span>
          <span className="sr-only">(required, one per line)</span>
        </label>
        <textarea
          id={`${idPrefix}-highlights`}
          name="highlights"
          rows={4}
          defaultValue={toTextareaValue(initialProject?.highlights)}
          required
          aria-required="true"
          aria-invalid={errors.highlights ? "true" : undefined}
          aria-describedby={errors.highlights ? `${idPrefix}-highlights-error` : undefined}
          className={errors.highlights ? errorInputClasses : inputClasses}
        />
        <p className="mt-1 text-xs text-slate-500">One highlight per line.</p>
        {errors.highlights && (
          <p id={`${idPrefix}-highlights-error`} className="mt-2 text-sm text-red-700">
            {errors.highlights}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
