"use client";

import { useState } from "react";
import {
  COMPANY_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NETWORKING_STATUS_LABELS,
  NETWORKING_STATUSES,
  NOTES_MAX_LENGTH,
} from "@/lib/networking-constants";
import { errorInputClasses, inputClasses } from "@/components/goals/FieldError";

export default function NetworkingForm({
  initialContact = null,
  submitLabel,
  onSubmit,
  onCancel = null,
}) {
  const isEditing = Boolean(initialContact);
  const idPrefix = isEditing ? "edit" : "new";
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateLocally(values) {
    const errors = {};
    if (!values.name) errors.name = "Please enter a name.";
    if (!values.company) errors.company = "Please enter a company.";
    if (!values.contactDate) errors.contactDate = "Please enter the contact date.";
    if (!values.status) errors.status = "Please choose a status.";
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      contactDate: String(formData.get("contactDate") ?? "").trim(),
      status: String(formData.get("status") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
    };

    const localErrors = validateLocally(values);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    let result;
    try {
      result = (await onSubmit(values)) ?? { ok: true, errors: {} };
    } catch {
      result = { ok: false, errors: {} };
    }
    setIsSubmitting(false);

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
          htmlFor={`${idPrefix}-networking-name`}
          className="block text-sm font-semibold text-slate-900"
        >
          Name <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          type="text"
          id={`${idPrefix}-networking-name`}
          name="name"
          defaultValue={initialContact?.name ?? ""}
          maxLength={NAME_MAX_LENGTH}
          required
          aria-required="true"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `${idPrefix}-networking-name-error` : undefined}
          placeholder="Who did you meet?"
          className={errors.name ? errorInputClasses : inputClasses}
        />
        {errors.name && (
          <p id={`${idPrefix}-networking-name-error`} className="mt-2 text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-networking-company`}
          className="block text-sm font-semibold text-slate-900"
        >
          Company <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          type="text"
          id={`${idPrefix}-networking-company`}
          name="company"
          defaultValue={initialContact?.company ?? ""}
          maxLength={COMPANY_MAX_LENGTH}
          required
          aria-required="true"
          aria-invalid={errors.company ? "true" : undefined}
          aria-describedby={errors.company ? `${idPrefix}-networking-company-error` : undefined}
          placeholder="Where do they work?"
          className={errors.company ? errorInputClasses : inputClasses}
        />
        {errors.company && (
          <p id={`${idPrefix}-networking-company-error`} className="mt-2 text-sm text-red-700">
            {errors.company}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${idPrefix}-networking-date`}
            className="block text-sm font-semibold text-slate-900"
          >
            Contact date <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="date"
            id={`${idPrefix}-networking-date`}
            name="contactDate"
            defaultValue={initialContact?.contactDate ?? ""}
            required
            aria-required="true"
            aria-invalid={errors.contactDate ? "true" : undefined}
            aria-describedby={errors.contactDate ? `${idPrefix}-networking-date-error` : undefined}
            className={errors.contactDate ? errorInputClasses : inputClasses}
          />
          {errors.contactDate && (
            <p id={`${idPrefix}-networking-date-error`} className="mt-2 text-sm text-red-700">
              {errors.contactDate}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-networking-status`}
            className="block text-sm font-semibold text-slate-900"
          >
            Status <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id={`${idPrefix}-networking-status`}
            name="status"
            defaultValue={initialContact?.status ?? NETWORKING_STATUSES[0]}
            required
            aria-required="true"
            aria-invalid={errors.status ? "true" : undefined}
            aria-describedby={errors.status ? `${idPrefix}-networking-status-error` : undefined}
            className={errors.status ? errorInputClasses : inputClasses}
          >
            {NETWORKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {NETWORKING_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          {errors.status && (
            <p id={`${idPrefix}-networking-status-error`} className="mt-2 text-sm text-red-700">
              {errors.status}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-networking-notes`}
          className="block text-sm font-semibold text-slate-900"
        >
          Notes <span className="sr-only">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-networking-notes`}
          name="notes"
          rows={3}
          defaultValue={initialContact?.notes ?? ""}
          maxLength={NOTES_MAX_LENGTH}
          aria-invalid={errors.notes ? "true" : undefined}
          aria-describedby={errors.notes ? `${idPrefix}-networking-notes-error` : undefined}
          placeholder="Optional: how you met, follow-up ideas, referrals"
          className={errors.notes ? errorInputClasses : inputClasses}
        />
        {errors.notes && (
          <p id={`${idPrefix}-networking-notes-error`} className="mt-2 text-sm text-red-700">
            {errors.notes}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
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
