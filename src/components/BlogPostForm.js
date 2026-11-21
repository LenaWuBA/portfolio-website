"use client";

import { useState } from "react";
import {
  CONTENT_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateBlogFields,
} from "@/lib/blog-constants";
import { errorInputClasses, inputClasses } from "@/components/goals/FieldError";

export default function BlogPostForm({
  initialPost = null,
  submitLabel,
  onSubmit,
  onCancel = null,
}) {
  const isEditing = Boolean(initialPost);
  const idPrefix = isEditing ? "edit-post" : "new-post";
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    const localErrors = validateBlogFields(title, content);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    const result = (await onSubmit({ title, content })) ?? { ok: false, errors: {} };
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
          defaultValue={initialPost?.title ?? ""}
          maxLength={TITLE_MAX_LENGTH}
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
          htmlFor={`${idPrefix}-content`}
          className="block text-sm font-semibold text-slate-900"
        >
          Content <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id={`${idPrefix}-content`}
          name="content"
          rows={8}
          defaultValue={initialPost?.content ?? ""}
          maxLength={CONTENT_MAX_LENGTH}
          required
          aria-required="true"
          aria-invalid={errors.content ? "true" : undefined}
          aria-describedby={errors.content ? `${idPrefix}-content-error` : undefined}
          className={errors.content ? errorInputClasses : inputClasses}
        />
        {errors.content && (
          <p id={`${idPrefix}-content-error`} className="mt-2 text-sm text-red-700">
            {errors.content}
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
