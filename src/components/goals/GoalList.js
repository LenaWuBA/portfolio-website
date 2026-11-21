"use client";

import GoalItem from "./GoalItem";

export default function GoalList({
  goals,
  editingId,
  onToggleComplete,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}) {
  if (goals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">No goals yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add your first learning goal with the form above. Goals are saved in
          your browser and restored the next time you visit.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4" aria-label="Your learning goals">
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          isEditing={editingId === goal.id}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </ul>
  );
}
