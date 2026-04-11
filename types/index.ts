export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "completed";

export interface TeamMember {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string; // ISO date string
  dueTime?: string; // HH:MM
  assignedTo?: string; // TeamMember id
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  tasks: Task[];
  teams: Team[];
}

export interface FilterState {
  priority: Priority | "all";
  status: Status | "all";
  assignedTo: string; // member id or "all"
  search: string;
}
