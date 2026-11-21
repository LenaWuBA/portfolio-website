export default function GoalStats({ total, completed, percentage }) {
  const stats = [
    { label: "Total goals", value: total },
    { label: "Completed", value: completed },
    { label: "Completion", value: `${percentage}%` },
  ];

  return (
    <section
      aria-label="Goal progress summary"
      className="rounded-xl border border-slate-200 bg-slate-50 p-6"
    >
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="status">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {stat.label}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-slate-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Percentage of goals completed"
      >
        <div
          className="h-full rounded-full bg-blue-700 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}
