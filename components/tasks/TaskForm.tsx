"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Task, Team, Priority } from "@/types";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => void;
  teams: Team[];
  initialData?: Task;
}

const defaultForm = {
  title: "",
  description: "",
  priority: "medium" as Priority,
  dueDate: "",
  dueTime: "",
  teamId: "",
  assignedTo: "",
};

export function TaskForm({ open, onClose, onSubmit, teams, initialData }: TaskFormProps) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description ?? "",
        priority: initialData.priority,
        dueDate: initialData.dueDate ?? "",
        dueTime: initialData.dueTime ?? "",
        teamId: initialData.teamId ?? "",
        assignedTo: initialData.assignedTo ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  const selectedTeam = teams.find((t) => t.id === form.teamId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
      dueTime: form.dueTime || undefined,
      teamId: form.teamId || undefined,
      assignedTo: form.assignedTo || undefined,
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="Task title…"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="desc"
              placeholder="Add more detail…"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Due Date</Label>
              <Input
                id="date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Due Time</Label>
              <Input
                id="time"
                type="time"
                value={form.dueTime}
                onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
              />
            </div>
          </div>

          {/* Team */}
          {teams.length > 0 && (
            <div className="space-y-1.5">
              <Label>Assign to Team</Label>
              <Select
                value={form.teamId || "none"}
                onValueChange={(v) =>
                  setForm({ ...form, teamId: v === "none" ? "" : v, assignedTo: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No team</SelectItem>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Member */}
          {selectedTeam && selectedTeam.members.length > 0 && (
            <div className="space-y-1.5">
              <Label>Assign to Member</Label>
              <Select
                value={form.assignedTo || "none"}
                onValueChange={(v) =>
                  setForm({ ...form, assignedTo: v === "none" ? "" : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {selectedTeam.members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Save Changes" : "Add Task"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
