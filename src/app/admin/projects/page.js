import ProjectAdmin from "@/components/admin/ProjectAdmin";

export const metadata = {
  title: "Project Admin",
};

export default function ProjectAdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Project Admin
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Add, edit, and remove the projects shown on the public Projects page.
        Records are stored in data/projects.json through the REST API. Existing
        project URLs stay stable when you edit a project. This page is a local
        coursework demonstration and is not access-controlled.
      </p>

      <ProjectAdmin />
    </div>
  );
}
