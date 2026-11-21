"use client";

import { useEffect, useState } from "react";
import StatusBanner from "@/components/shared/StatusBanner";
import {
  errorInputClasses,
  inputClasses,
} from "@/components/goals/FieldError";

const initialFeedback = { status: "idle", message: "" };

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-slate-800">{children}</dd>
    </div>
  );
}

async function fetchSubmissions() {
  try {
    const response = await fetch("/api/contacts");
    const data = await response.json().catch(() => null);
    if (response.ok && data?.status === "success") {
      return { submissions: data.submissions, error: "" };
    }
    return {
      submissions: null,
      error:
        data?.message ?? "Contact submissions could not be loaded right now.",
    };
  } catch {
    return {
      submissions: null,
      error: "Network error: could not load contact submissions.",
    };
  }
}

function SubmissionForm({ submission, submitLabel, onSubmit, onCancel }) {
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSaving(true);
    const result = (await onSubmit({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    })) ?? { ok: false, errors: {} };
    setIsSaving(false);

    if (result.ok) {
      setErrors({});
    } else {
      setErrors(result.errors ?? {});
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
      <div>
        <label
          htmlFor={`edit-name-${submission.id}`}
          className="block text-sm font-semibold text-slate-900"
        >
          Name
        </label>
        <input
          type="text"
          id={`edit-name-${submission.id}`}
          name="name"
          defaultValue={submission.name}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `edit-name-error-${submission.id}` : undefined}
          className={errors.name ? errorInputClasses : inputClasses}
        />
        {errors.name && (
          <p id={`edit-name-error-${submission.id}`} className="mt-2 text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`edit-email-${submission.id}`}
          className="block text-sm font-semibold text-slate-900"
        >
          Email
        </label>
        <input
          type="email"
          id={`edit-email-${submission.id}`}
          name="email"
          defaultValue={submission.email}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? `edit-email-error-${submission.id}` : undefined}
          className={errors.email ? errorInputClasses : inputClasses}
        />
        {errors.email && (
          <p id={`edit-email-error-${submission.id}`} className="mt-2 text-sm text-red-700">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`edit-message-${submission.id}`}
          className="block text-sm font-semibold text-slate-900"
        >
          Message
        </label>
        <textarea
          id={`edit-message-${submission.id}`}
          name="message"
          rows={4}
          defaultValue={submission.message}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `edit-message-error-${submission.id}` : undefined}
          className={errors.message ? errorInputClasses : inputClasses}
        />
        {errors.message && (
          <p id={`edit-message-error-${submission.id}`} className="mt-2 text-sm text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ContactAdmin() {
  const [submissions, setSubmissions] = useState(null);
  const [listError, setListError] = useState("");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [editingId, setEditingId] = useState(null);
  const [viewedId, setViewedId] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSubmissions().then((result) => {
      if (!active) return;
      setSubmissions(result.submissions);
      setListError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleUpdate(id, values) {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
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
        setSubmissions((current) =>
          (current ?? []).map((submission) =>
            submission.id === id ? data.submission : submission
          )
        );
        setEditingId(null);
        setFeedback({
          status: "success",
          message: "Submission updated successfully.",
        });
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message: data.message ?? "The submission could not be updated.",
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
    const target = (submissions ?? []).find(
      (submission) => submission.id === id
    );
    try {
      const response = await fetch(`/api/contacts/${id}`, {
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
        setSubmissions((current) =>
          (current ?? []).filter((submission) => submission.id !== id)
        );
        if (editingId === id) {
          setEditingId(null);
        }
        setFeedback({
          status: "success",
          message: target
            ? `Submission from ${target.name} deleted.`
            : "Submission deleted.",
        });
        return;
      }

      setFeedback({
        status: "error",
        message: data.message ?? "The submission could not be deleted.",
      });
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
      });
    }
  }

  if (submissions === null) {
    return (
      <p role="status" className="mt-10 text-sm text-slate-500">
        Loading submissions...
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <StatusBanner status={feedback.status} message={feedback.message} />

      {listError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-medium text-red-800">{listError}</p>
          <button
            type="button"
            onClick={() => {
              setSubmissions(null);
              setListError("");
              fetchSubmissions().then((result) => {
                setSubmissions(result.submissions);
                setListError(result.error);
              });
            }}
            className="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!listError && submissions.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-slate-900">
            No submissions yet
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Messages sent through either contact form will appear here.
          </p>
        </div>
      )}

      {submissions.length > 0 && (
        <ul className="space-y-4" aria-label="Contact submissions">
          {submissions
            .slice()
            .reverse()
            .map((submission) => (
              <li
                key={submission.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {submission.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {submission.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Submitted{" "}
                      {new Date(submission.submittedAt).toLocaleString(
                        "en-US",
                        { dateStyle: "medium", timeStyle: "short" }
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setViewedId((current) =>
                          current === submission.id ? null : submission.id
                        )
                      }
                      aria-expanded={viewedId === submission.id}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                      {viewedId === submission.id ? "Hide" : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(submission.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(submission.id)}
                      aria-label={`Delete submission from ${submission.name}`}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {viewedId === submission.id && editingId !== submission.id && (
                  <dl className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4">
                    <Field label="Name">
                      {submission.name}
                    </Field>
                    <Field label="Email">
                      {submission.email}
                    </Field>
                    <Field label="Message">
                      {submission.message}
                    </Field>
                  </dl>
                )}

                {editingId === submission.id && (
                  <SubmissionForm
                    key={submission.id}
                    submission={submission}
                    submitLabel="Save Changes"
                    onSubmit={(values) => handleUpdate(submission.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
