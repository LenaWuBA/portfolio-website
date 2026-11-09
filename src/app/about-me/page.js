export const metadata = {
  title: "About Me",
};

const skillGroups = [
  {
    heading: "Business and Strategy",
    skills: ["Business Development", "Strategic Partnerships", "Key Account Management"],
  },
  {
    heading: "Analytics and Tools",
    skills: ["Python", "SQL", "Power BI", "Tableau", "Machine Learning"],
  },
];

export default function AboutMe() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        About Me
      </h1>

      <section className="mt-10" aria-labelledby="background-heading">
        <h2 id="background-heading" className="text-xl font-semibold text-slate-900">
          Professional Background
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          I have 11 years of experience in enterprise B2B business development
          and key account management. My work has centered on understanding
          complex client needs, building strategic partnerships, and guiding
          long-term accounts through changing priorities.
        </p>
        <p className="mt-3 leading-7 text-slate-600">
          Across that time I have worked through the full relationship
          lifecycle, from identifying new opportunities and developing partner
          relationships to day-to-day account stewardship and renewal planning.
          That experience gave me a practical view of how business decisions are
          made, and of where data can sharpen them.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="studies-heading">
        <h2 id="studies-heading" className="text-xl font-semibold text-slate-900">
          Graduate Studies
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          I am currently pursuing a Master of Science in Business Analytics at
          Santa Clara University. The program is strengthening my analytical
          toolkit across Python, SQL, machine learning, and data visualization
          with Power BI and Tableau, with a focus on applying those tools to
          real commercial problems.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="text-xl font-semibold text-slate-900">
          Skills
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div
              key={group.heading}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                {group.heading}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="focus-heading">
        <h2 id="focus-heading" className="text-xl font-semibold text-slate-900">
          Career Focus
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          I am looking for opportunities where enterprise sales experience and
          hands-on analytics overlap: roles that translate data into revenue
          strategy, account growth, and better decisions for customers.
        </p>
      </section>
    </div>
  );
}
