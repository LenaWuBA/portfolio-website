import Link from "next/link";

const skills = [
  "Business Development",
  "Strategic Partnerships",
  "Python",
  "SQL",
  "Power BI",
  "Tableau",
  "Machine Learning",
];

const primaryButton =
  "inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2";
const secondaryButton =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2";

export default function Home() {
  return (
    <>
      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
          MS in Business Analytics · Santa Clara University
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Connecting Business Strategy with Data-Driven Insights
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          I am a business development professional with 11 years of enterprise
          B2B experience in strategic partnerships and key account management. I
          am now pursuing a Master of Science in Business Analytics at Santa
          Clara University, adding hands-on skills in analytics and machine
          learning to that commercial foundation.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/about-me" className={primaryButton}>
            About Me
          </Link>
          <Link href="/projects" className={secondaryButton}>
            Projects
          </Link>
          <Link href="/contact-me-server-form" className={secondaryButton}>
            Contact Me
          </Link>
        </div>
      </section>

      <section aria-label="Skills and focus areas" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500">
            Skills and Focus Areas
          </h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
