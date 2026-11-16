"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const initialFeedback = { status: "idle", message: "", errors: {} };

async function fetchPosts() {
  try {
    const response = await fetch("/api/blogs");
    const data = await response.json().catch(() => null);
    if (response.ok && data?.status === "success") {
      return { posts: data.posts, error: "" };
    }
    return {
      posts: null,
      error: data?.message ?? "Blog posts could not be loaded right now.",
    };
  } catch {
    return {
      posts: null,
      error: "Network error: could not load blog posts.",
    };
  }
}

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

export default function BlogAdmin() {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState(null);
  const [listError, setListError] = useState("");

  useEffect(() => {
    let active = true;
    fetchPosts().then((result) => {
      if (!active) return;
      setPosts(result.posts);
      setListError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setFeedback(initialFeedback);

    const formData = new FormData(form);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          content: formData.get("content"),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!data) {
        setFeedback({
          status: "error",
          message: "Unexpected server response. Please try again later.",
          errors: {},
        });
      } else if (response.ok) {
        setFeedback({
          status: "success",
          message: data.message,
          errors: {},
        });
        form.reset();
        const result = await fetchPosts();
        if (!result.error) {
          setPosts(result.posts);
          setListError("");
        }
      } else {
        setFeedback({
          status: "error",
          message: data.message,
          errors: data.errors ?? {},
        });
      }
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
        errors: {},
      });
    }

    setIsSubmitting(false);
  }

  const errors = feedback.errors ?? {};

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {feedback.status === "success" && (
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
          >
            {feedback.message}
          </p>
        )}

        {feedback.status === "error" && feedback.message && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {feedback.message}
          </p>
        )}

        <div>
          <label
            htmlFor="blog-title"
            className="block text-sm font-semibold text-slate-900"
          >
            Title
          </label>
          <input
            type="text"
            id="blog-title"
            name="title"
            required
            aria-invalid={errors.title ? "true" : undefined}
            aria-describedby={errors.title ? "blog-title-error" : undefined}
            className={errors.title ? errorInputClasses : inputClasses}
          />
          <FieldError id="blog-title-error" message={errors.title} />
        </div>

        <div>
          <label
            htmlFor="blog-content"
            className="block text-sm font-semibold text-slate-900"
          >
            Content
          </label>
          <textarea
            id="blog-content"
            name="content"
            rows={8}
            required
            aria-invalid={errors.content ? "true" : undefined}
            aria-describedby={errors.content ? "blog-content-error" : undefined}
            className={errors.content ? errorInputClasses : inputClasses}
          />
          <FieldError id="blog-content-error" message={errors.content} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </form>

      <section aria-labelledby="existing-posts-heading">
        <h2
          id="existing-posts-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Existing Posts
        </h2>
        {listError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {listError}
          </p>
        )}
        {!listError && posts === null && (
          <p className="mt-4 text-sm text-slate-500">Loading posts...</p>
        )}
        {!listError && posts !== null && posts.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">
            No blog posts yet. Publish your first post with the form.
          </p>
        )}
        {!listError && posts !== null && posts.length > 0 && (
          <ul className="mt-4 divide-y divide-slate-100">
            {posts.map((post) => (
              <li key={post.id} className="py-3">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
