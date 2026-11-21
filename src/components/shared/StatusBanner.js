const styles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

export default function StatusBanner({ status, message }) {
  if (!message || status === "idle") return null;
  return (
    <p
      role={status === "success" ? "status" : "alert"}
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${styles[status] ?? styles.error}`}
    >
      {message}
    </p>
  );
}
