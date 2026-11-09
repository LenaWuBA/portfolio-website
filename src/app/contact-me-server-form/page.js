import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Me",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Contact Me
      </h1>
      <p className="mt-3 leading-7 text-slate-600">
        Whether you would like to talk about analytics, business development,
        or a potential opportunity, I would be glad to hear from you. Use the
        form below to send me a message.
      </p>

      <ContactForm />
    </div>
  );
}
