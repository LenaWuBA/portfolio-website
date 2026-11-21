"use client";

import GoalForm from "./GoalForm";

export default function GoalItem({
  goal,
  isEditing,
  onToggleComplete,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}) {
  return (
    <li
      className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${
        goal.completed ? "border-green-200 bg-green-50/40" : "border-slate-200"
      }`}
    >
      {isEditing ? (
        <GoalForm
          initialGoal={goal}
          submitLabel="Save Changes"
          onSubmit={(values) => onUpdate(goal.id, values)}
          onCancel={onCancelEdit}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3
                className={`text-base font-semibold ${
                  goal.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-900"
                }`}
              >
                {goal.title}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                {goal.category}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                goal.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {goal.completed ? "Completed" : "In progress"}
            </span>
          </div>

          {goal.notes && (
            <p className="mt-3 text-sm leading-6 text-slate-600">{goal.notes}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToggleComplete(goal.id)}
              aria-pressed={goal.completed}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              {goal.completed ? "Mark incomplete" : "Mark complete"}
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete goal: ${goal.title}`}
              className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
