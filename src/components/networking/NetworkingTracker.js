"use client";

import { useEffect, useState } from "react";
import NetworkingCard from "./NetworkingCard";
import NetworkingForm from "./NetworkingForm";

const initialFeedback = { status: "idle", message: "" };

async function apiRequest(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);
  return { response, data };
}

async function fetchNetworkingContacts() {
  try {
    const { response, data } = await apiRequest("/api/networking");
    if (response.ok && data?.status === "success") {
      return { contacts: data.contacts, error: "" };
    }
    return {
      contacts: [],
      error: data?.message ?? "Networking contacts could not be loaded.",
    };
  } catch {
    return {
      contacts: [],
      error: "Network error: could not load networking contacts.",
    };
  }
}

export default function NetworkingTracker() {
  const [contacts, setContacts] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let active = true;
    fetchNetworkingContacts().then((result) => {
      if (!active) return;
      setContacts(result.contacts);
      setLoadError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleLoadRetry() {
    setContacts(null);
    setLoadError("");
    fetchNetworkingContacts().then((result) => {
      setContacts(result.contacts);
      setLoadError(result.error);
    });
  }

  async function handleAddContact(values) {
    try {
      const { response, data } = await apiRequest("/api/networking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
        });
        return { ok: false, errors: {} };
      }

      if (response.status === 201 && data.status === "success") {
        setContacts((current) => [data.contact, ...(current ?? [])]);
        setFeedback({
          status: "success",
          message: `Contact "${data.contact.name}" added.`,
        });
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message:
          data.message ??
          "Sorry, the contact could not be saved right now. Please try again later.",
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

  async function handleUpdateContact(id, values) {
    try {
      const { response, data } = await apiRequest(`/api/networking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
        });
        return { ok: false, errors: {} };
      }

      if (response.ok && data.status === "success") {
        setContacts((current) =>
          (current ?? []).map((contact) =>
            contact.id === id ? data.contact : contact
          )
        );
        setEditingId(null);
        setFeedback({
          status: "success",
          message: `Contact "${data.contact.name}" updated.`,
        });
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message:
          data.message ??
          "Sorry, the contact could not be updated right now. Please try again later.",
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

  async function handleDeleteContact(id) {
    const target = (contacts ?? []).find((contact) => contact.id === id);
    try {
      const { response, data } = await apiRequest(`/api/networking/${id}`, {
        method: "DELETE",
      });

      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
        });
        return;
      }

      if (response.ok && data.status === "success") {
        setContacts((current) =>
          (current ?? []).filter((contact) => contact.id !== id)
        );
        if (editingId === id) {
          setEditingId(null);
        }
        setFeedback({
          status: "success",
          message: target
            ? `Contact "${target.name}" deleted.`
            : "Contact deleted.",
        });
        return;
      }

      setFeedback({
        status: "error",
        message:
          data.message ??
          "Sorry, the contact could not be deleted right now. Please try again later.",
      });
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
      });
    }
  }

  if (contacts === null) {
    return (
      <p role="status" className="mt-10 text-sm text-slate-500">
        Loading networking contacts...
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      {loadError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-medium text-red-800">{loadError}</p>
          <button
            type="button"
            onClick={handleLoadRetry}
            className="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {feedback.status !== "idle" && feedback.message && (
        <p
          role={feedback.status === "success" ? "status" : "alert"}
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.status === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </p>
      )}

      <section aria-labelledby="add-networking-heading">
        <h2
          id="add-networking-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Add a contact
        </h2>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <NetworkingForm
            submitLabel="Add Contact"
            onSubmit={handleAddContact}
          />
        </div>
      </section>

      <section aria-labelledby="networking-list-heading">
        <h2
          id="networking-list-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Your network
        </h2>
        <div className="mt-4">
          {contacts.length === 0 && !loadError ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No contacts yet
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add your first networking contact with the form above. Records
                are saved on the server in data/networking.json.
              </p>
            </div>
          ) : (
            <ul className="space-y-4" aria-label="Your networking contacts">
              {contacts.map((contact) => (
                <NetworkingCard
                  key={contact.id}
                  contact={contact}
                  isEditing={editingId === contact.id}
                  onEdit={() => setEditingId(contact.id)}
                  onDelete={() => handleDeleteContact(contact.id)}
                  onUpdate={handleUpdateContact}
                  onCancelEdit={() => setEditingId(null)}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
