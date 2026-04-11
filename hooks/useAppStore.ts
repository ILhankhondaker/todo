"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Task, Team, TeamMember, AppState, Priority, Status } from "@/types";

const STORAGE_KEY = "taskflow_data";

const DEFAULT_STATE: AppState = {
  tasks: [],
  teams: [],
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useAppStore() {
  const [state, setState, isLoaded] = useLocalStorage<AppState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  // ── Tasks ──────────────────────────────────────────────────────────────────

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...task,
        id: generateId(),
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };
      setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    },
    [setState]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ),
      }));
    },
    [setState]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
      }));
    },
    [setState]
  );

  const toggleTaskStatus = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: t.status === "completed" ? "pending" : "completed",
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      }));
    },
    [setState]
  );

  // ── Teams ──────────────────────────────────────────────────────────────────

  const addTeam = useCallback(
    (name: string) => {
      const newTeam: Team = {
        id: generateId(),
        name,
        members: [],
      };
      setState((prev) => ({ ...prev, teams: [...prev.teams, newTeam] }));
      return newTeam.id;
    },
    [setState]
  );

  const updateTeam = useCallback(
    (id: string, name: string) => {
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => (t.id === id ? { ...t, name } : t)),
      }));
    },
    [setState]
  );

  const deleteTeam = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        teams: prev.teams.filter((t) => t.id !== id),
        tasks: prev.tasks.map((task) =>
          task.teamId === id
            ? { ...task, teamId: undefined, assignedTo: undefined }
            : task
        ),
      }));
    },
    [setState]
  );

  const addTeamMember = useCallback(
    (teamId: string, memberName: string) => {
      const newMember: TeamMember = { id: generateId(), name: memberName };
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId ? { ...t, members: [...t.members, newMember] } : t
        ),
      }));
    },
    [setState]
  );

  const removeTeamMember = useCallback(
    (teamId: string, memberId: string) => {
      setState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId
            ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
            : t
        ),
        tasks: prev.tasks.map((task) =>
          task.assignedTo === memberId
            ? { ...task, assignedTo: undefined }
            : task
        ),
      }));
    },
    [setState]
  );

  return {
    tasks: state.tasks,
    teams: state.teams,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
  };
}
