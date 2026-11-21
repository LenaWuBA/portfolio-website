"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  createGoal,
  getGoalsServerSnapshot,
  getGoalsSnapshot,
  saveGoals,
  subscribeToGoals,
} from "@/lib/goals";
import GoalForm from "./GoalForm";
import GoalList from "./GoalList";
import GoalStats from "./GoalStats";

const initialFeedback = { status: "idle", message: "" };

export default function LearningGoalsTracker() {
  const snapshot = useSyncExternalStore(
    subscribeToGoals,
    getGoalsSnapshot,
    getGoalsServerSnapshot
  );
  const goals = snapshot.goals;
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState(initialFeedback);

  useEffect(() => {
    if (snapshot.corrupted) {
      saveGoals(goals);
    }
  }, [snapshot.corrupted, goals]);

  function handleAddGoal(values) {
    const goal = createGoal(values);
    const saved = saveGoals([goal, ...goals]);
    setFeedback(
      saved
        ? { status: "success", message: `Goal "${goal.title}" added.` }
        : saveFailedFeedback()
    );
  }

  function handleUpdateGoal(id, values) {
    const saved = saveGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, ...values, updatedAt: new Date().toISOString() }
          : goal
      )
    );
    if (saved) {
      setEditingId(null);
      setFeedback({ status: "success", message: "Goal updated." });
    } else {
      setFeedback(saveFailedFeedback());
    }
  }

  function handleToggleComplete(id) {
    const saved = saveGoals(
      goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed: !goal.completed,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );
    if (saved) {
      setFeedback(initialFeedback);
    } else {
      setFeedback(saveFailedFeedback());
    }
  }

  function handleDeleteGoal(id) {
    const target = goals.find((goal) => goal.id === id);
    const saved = saveGoals(goals.filter((goal) => goal.id !== id));
    if (saved) {
      if (editingId === id) {
        setEditingId(null);
      }
      setFeedback({
        status: "success",
        message: target ? `Goal "${target.title}" deleted.` : "Goal deleted.",
      });
    } else {
      setFeedback(saveFailedFeedback());
    }
  }

  if (goals === null) {
    return (
      <p role="status" className="mt-10 text-sm text-slate-500">
        Loading saved goals...
      </p>
    );
  }

  const total = goals.length;
  const completed = goals.filter((goal) => goal.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mt-10 space-y-10">
      {snapshot.unavailable && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          Goal saving is not available in this browser, so your goals will only
          last for this visit.
        </p>
      )}

      {snapshot.corrupted && (
        <p
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
        >
          Your saved goals contained invalid data and could not be fully
          restored. The list has been cleaned up.
        </p>
      )}

      <GoalStats total={total} completed={completed} percentage={percentage} />

      {feedback.status !== "idle" && feedback.message && (
        <p
          role={feedback.status === "success" ? "status" : "alert"}
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.status === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </p>
      )}

      <section aria-labelledby="add-goal-heading">
        <h2
          id="add-goal-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Add a goal
        </h2>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <GoalForm submitLabel="Add Goal" onSubmit={handleAddGoal} />
        </div>
      </section>

      <section aria-labelledby="goals-heading">
        <h2
          id="goals-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Your goals
        </h2>
        <div className="mt-4">
          <GoalList
            goals={goals}
            editingId={editingId}
            onToggleComplete={handleToggleComplete}
            onEdit={setEditingId}
            onDelete={handleDeleteGoal}
            onUpdate={handleUpdateGoal}
            onCancelEdit={() => setEditingId(null)}
          />
        </div>
      </section>
    </div>
  );
}

function saveFailedFeedback() {
  return {
    status: "error",
    message:
      "Your changes could not be saved. Please check your browser settings and try again.",
  };
}
