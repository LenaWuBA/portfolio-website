import Link from "next/link";
import { notFound } from "next/navigation";
import { readBlogPosts, getBlogPostBySlug } from "@/lib/blogs";

export const instant = false;

export async function generateStaticParams() {
  const posts = await readBlogPosts();
  if (posts.length === 0) {
    return [{ slug: "__blog_placeholder__" }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return { title: post.title };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
      >
        <span aria-hidden="true">←</span> Back to Blogs
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {post.title}
      </h1>

      <p className="mt-3 text-sm text-slate-500">
        Published{" "}
        {new Date(post.createdAt).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </p>

      <div className="mt-8 space-y-4">
        {post.content.split(/\r?\n\r?\n/).map((paragraph, index) => (
          <p key={index} className="leading-7 text-slate-600">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
