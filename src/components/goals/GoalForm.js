"use client";

import { useState } from "react";
import {
  GOAL_CATEGORIES,
  NOTES_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateGoalFields,
} from "@/lib/goals";
import FieldError, { errorInputClasses, inputClasses } from "./FieldError";

export default function GoalForm({
  initialGoal = null,
  submitLabel,
  onSubmit,
  onCancel = null,
}) {
  const isEditing = Boolean(initialGoal);
  const [errors, setErrors] = useState({});

  const categories = isEditing &&
    initialGoal.category &&
    !GOAL_CATEGORIES.includes(initialGoal.category)
    ? [...GOAL_CATEGORIES, initialGoal.category]
    : GOAL_CATEGORIES;

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    const fieldErrors = validateGoalFields(title, category, notes);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit({ title, category, notes });
    if (!isEditing) {
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor={`${isEditing ? "edit" : "new"}-goal-title`}
          className="block text-sm font-semibold text-slate-900"
        >
          Goal title <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          type="text"
          id={`${isEditing ? "edit" : "new"}-goal-title`}
          name="title"
          defaultValue={initialGoal?.title ?? ""}
          maxLength={TITLE_MAX_LENGTH}
          required
          aria-required="true"
          aria-invalid={errors.title ? "true" : undefined}
          aria-describedby={errors.title ? `${isEditing ? "edit" : "new"}-goal-title-error` : undefined}
          className={errors.title ? errorInputClasses : inputClasses}
        />
        <FieldError
          id={`${isEditing ? "edit" : "new"}-goal-title-error`}
          message={errors.title}
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? "edit" : "new"}-goal-category`}
          className="block text-sm font-semibold text-slate-900"
        >
          Category <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <select
          id={`${isEditing ? "edit" : "new"}-goal-category`}
          name="category"
          defaultValue={initialGoal?.category ?? GOAL_CATEGORIES[0]}
          required
          aria-required="true"
          aria-invalid={errors.category ? "true" : undefined}
          aria-describedby={
            errors.category ? `${isEditing ? "edit" : "new"}-goal-category-error` : undefined
          }
          className={errors.category ? errorInputClasses : inputClasses}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <FieldError
          id={`${isEditing ? "edit" : "new"}-goal-category-error`}
          message={errors.category}
        />
      </div>

      <div>
        <label
          htmlFor={`${isEditing ? "edit" : "new"}-goal-notes`}
          className="block text-sm font-semibold text-slate-900"
        >
          Notes <span className="sr-only">(optional)</span>
        </label>
        <textarea
          id={`${isEditing ? "edit" : "new"}-goal-notes`}
          name="notes"
          rows={3}
          defaultValue={initialGoal?.notes ?? ""}
          maxLength={NOTES_MAX_LENGTH}
          aria-invalid={errors.notes ? "true" : undefined}
          aria-describedby={errors.notes ? `${isEditing ? "edit" : "new"}-goal-notes-error` : undefined}
          placeholder="Optional details, resources, or a target date"
          className={errors.notes ? errorInputClasses : inputClasses}
        />
        <FieldError
          id={`${isEditing ? "edit" : "new"}-goal-notes-error`}
          message={errors.notes}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          {submitLabel}
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
