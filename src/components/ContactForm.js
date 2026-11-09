"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/contact-me-server-form/actions";

const initialState = { status: "idle", message: "", errors: {} };

const inputClasses =
  "mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/30";
const errorInputClasses =
  "mt-2 block w-full rounded-lg border border-red-500 px-3 py-2 text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30";

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-700">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState
  );
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="mt-10 space-y-6">
      {state.status === "success" && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
        >
          {state.message}
        </p>
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.message}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-900"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? errorInputClasses : inputClasses}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-900"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={errors.email ? errorInputClasses : inputClasses}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-slate-900"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={errors.message ? errorInputClasses : inputClasses}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
