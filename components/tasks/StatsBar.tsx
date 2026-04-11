import type { Task } from "@/types";

interface StatsBarProps {
  tasks: Task[];
}

export function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const high = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;

  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Stat label="Total" value={total} />
        <Stat label="Completed" value={completed} color="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Pending" value={pending} color="text-amber-600 dark:text-amber-400" />
        <Stat label="High Priority" value={high} color="text-red-600 dark:text-red-400" />
      </div>

      {total > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color = "text-foreground",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
