import LearningGoalsTracker from "@/components/goals/LearningGoalsTracker";

export const metadata = {
  title: "Learning Goals",
};

export default function LearningGoalsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Learning Goals
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Track what you want to learn next. Add goals, mark them complete as you
        progress, and review your overall completion. Your goals are stored
        privately in this browser using localStorage, so they are here the next
        time you visit.
      </p>

      <LearningGoalsTracker />
    </div>
  );
}
