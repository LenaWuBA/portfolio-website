import BlogList from "@/components/BlogList";

export const metadata = {
  title: "Blogs",
};

export default function BlogsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Blogs
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Short articles on business development, analytics, and what I am
        learning in the MS in Business Analytics program.
      </p>

      <BlogList />
    </div>
  );
}
