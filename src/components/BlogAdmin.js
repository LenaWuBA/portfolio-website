"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatusBanner from "@/components/shared/StatusBanner";
import BlogPostForm from "./BlogPostForm";

const initialFeedback = { status: "idle", message: "" };

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

export default function BlogAdmin() {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [posts, setPosts] = useState(null);
  const [listError, setListError] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  async function handlePublish(values) {
    try {
      const response = await fetch("/api/blogs", {
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
        setFeedback({
          status: "success",
          message: data.message,
        });
        const result = await fetchPosts();
        if (!result.error) {
          setPosts(result.posts);
          setListError("");
        }
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message:
          data.message ?? "Sorry, the blog post could not be saved right now.",
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
      const response = await fetch(`/api/blogs/${id}`, {
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
        setFeedback({
          status: "success",
          message: `Post "${data.post.title}" updated.`,
        });
        setEditingId(null);
        const result = await fetchPosts();
        if (!result.error) {
          setPosts(result.posts);
          setListError("");
        }
        return { ok: true, errors: {} };
      }

      if (response.status === 400) {
        return { ok: false, errors: data.errors ?? {} };
      }

      setFeedback({
        status: "error",
        message: data.message ?? "Sorry, the post could not be updated.",
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
    const target = (posts ?? []).find((post) => post.id === id);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
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
        setPosts((current) =>
          (current ?? []).filter((post) => post.id !== id)
        );
        if (editingId === id) {
          setEditingId(null);
        }
        setFeedback({
          status: "success",
          message: target
            ? `Post "${target.title}" deleted.`
            : "Post deleted.",
        });
        return;
      }

      setFeedback({
        status: "error",
        message: data.message ?? "Sorry, the post could not be deleted.",
      });
    } catch {
      setFeedback({
        status: "error",
        message:
          "Network error: could not reach the server. Please check your connection and try again.",
      });
    }
  }

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-2">
      <section aria-labelledby="publish-post-heading">
        <h2
          id="publish-post-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Publish a new post
        </h2>
        <div className="mt-4">
          <StatusBanner status={feedback.status} message={feedback.message} />
          <div className="mt-4">
            <BlogPostForm submitLabel="Publish" onSubmit={handlePublish} />
          </div>
        </div>
      </section>

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
          <ul className="mt-4 space-y-4">
            {posts.map((post) =>
              editingId === post.id ? (
                <li
                  key={post.id}
                  className="rounded-xl border border-blue-200 bg-blue-50/40 p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Editing post
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Public URL will change if you edit the title:
                    /blogs/{post.slug}
                  </p>
                  <div className="mt-4">
                    <BlogPostForm
                      initialPost={post}
                      submitLabel="Save Changes"
                      onSubmit={(values) => handleUpdate(post.id, values)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                </li>
              ) : (
                <li
                  key={post.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(post.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      aria-label={`Delete post: ${post.title}`}
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
