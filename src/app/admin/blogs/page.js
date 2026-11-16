import BlogAdmin from "@/components/BlogAdmin";

export const metadata = {
  title: "Blog Admin",
};

export default function BlogAdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Blog Admin
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Publish new articles and review existing posts. This page is a local
        coursework demonstration and is not access-controlled.
      </p>

      <BlogAdmin />
    </div>
  );
}
