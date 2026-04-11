"use client";

import { format } from "date-fns";
import { Check, Clock, Pencil, Trash2, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task, Team } from "@/types";

interface TaskCardProps {
  task: Task;
  teams: Team[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, teams, onToggle, onEdit, onDelete }: TaskCardProps) {
  const team = teams.find((t) => t.id === task.teamId);
  const member = team?.members.find((m) => m.id === task.assignedTo);
  const isDone = task.status === "completed";

  const isOverdue =
    !isDone &&
    task.dueDate &&
    new Date(`${task.dueDate}T${task.dueTime || "23:59"}`) < new Date();

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        isDone && "opacity-60",
        isOverdue && "border-red-300 dark:border-red-800"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isDone
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 hover:border-primary"
          )}
          aria-label={isDone ? "Mark as pending" : "Mark as complete"}
        >
          {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium leading-snug",
              isDone && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />

            {(task.dueDate || task.dueTime) && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs text-muted-foreground",
                  isOverdue && "text-red-500 font-medium"
                )}
              >
                {isOverdue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {task.dueDate &&
                  format(new Date(task.dueDate + "T00:00:00"), "MMM d, yyyy")}
                {task.dueTime && ` · ${task.dueTime}`}
              </span>
            )}

            {member && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {member.name}
                {team && (
                  <span className="text-muted-foreground/60">· {team.name}</span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
