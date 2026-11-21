import ContactAdmin from "@/components/admin/ContactAdmin";

export const metadata = {
  title: "Contact Admin",
};

export default function ContactAdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Contact Admin
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Review the messages submitted through the contact forms, correct them
        if needed, and remove entries you no longer need. Submissions come from
        both the API contact form and the Server Action form, and are stored in
        data/contact-submissions.json. This page is a local coursework
        demonstration and is not access-controlled.
      </p>

      <ContactAdmin />
    </div>
  );
}
