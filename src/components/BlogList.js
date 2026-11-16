"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json().catch(() => null);
        if (response.ok && data?.status === "success") {
          setPosts(data.posts);
          setError("");
        } else {
          setError(data?.message ?? "Blog posts could not be loaded.");
        }
      } catch {
        setError("Network error: could not load blog posts.");
      }
    }

    loadPosts();
  }, []);

  if (error) {
    return (
      <p role="alert" className="mt-10 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (posts === null) {
    return <p className="mt-10 text-sm text-slate-500">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">No posts yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Check back soon. New articles will appear here once they are
          published.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <article
          key={post.id}
          className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            <Link
              href={`/blogs/${post.slug}`}
              className="transition-colors hover:text-blue-700"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
            {post.content.length > 160
              ? `${post.content.slice(0, 160).trimEnd()}...`
              : post.content}
          </p>
          <Link
            href={`/blogs/${post.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
          >
            Read article
            <span aria-hidden="true">→</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
