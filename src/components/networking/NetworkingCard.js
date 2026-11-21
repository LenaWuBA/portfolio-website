"use client";

import { NETWORKING_STATUS_LABELS } from "@/lib/networking-constants";
import NetworkingForm from "./NetworkingForm";

const statusBadgeClasses = {
  new: "bg-blue-100 text-blue-800",
  "follow-up": "bg-amber-100 text-amber-800",
  connected: "bg-green-100 text-green-800",
  archived: "bg-slate-100 text-slate-600",
};

export default function NetworkingCard({
  contact,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}) {
  if (isEditing) {
    return (
      <li className="rounded-xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Editing contact
        </h3>
        <div className="mt-4">
          <NetworkingForm
            initialContact={contact}
            submitLabel="Save Changes"
            onSubmit={(values) => onUpdate(contact.id, values)}
            onCancel={onCancelEdit}
          />
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {contact.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{contact.company}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusBadgeClasses[contact.status] ?? statusBadgeClasses.archived
          }`}
        >
          {NETWORKING_STATUS_LABELS[contact.status] ?? contact.status}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Last contact:{" "}
        <time dateTime={contact.contactDate}>{contact.contactDate}</time>
      </p>

      {contact.notes && (
        <p className="mt-3 text-sm leading-6 text-slate-600">{contact.notes}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete contact: ${contact.name}`}
          className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
