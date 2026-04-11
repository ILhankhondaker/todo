"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FilterState, Team } from "@/types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  teams: Team[];
}

export function FilterBar({ filters, onChange, teams }: FilterBarProps) {
  // Collect all members across all teams
  const allMembers = teams.flatMap((t) =>
    t.members.map((m) => ({ ...m, teamName: t.name }))
  );

  const hasActiveFilters =
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.assignedTo !== "all" ||
    filters.search !== "";

  function reset() {
    onChange({ priority: "all", status: "all", assignedTo: "all", search: "" });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks…"
          className="pl-8"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Priority filter */}
      <Select
        value={filters.priority}
        onValueChange={(v) => onChange({ ...filters, priority: v as FilterState["priority"] })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">🔴 High</SelectItem>
          <SelectItem value="medium">🟡 Medium</SelectItem>
          <SelectItem value="low">🟢 Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select
        value={filters.status}
        onValueChange={(v) => onChange({ ...filters, status: v as FilterState["status"] })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* Member filter */}
      {allMembers.length > 0 && (
        <Select
          value={filters.assignedTo}
          onValueChange={(v) => onChange({ ...filters, assignedTo: v })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            {allMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
                <span className="ml-1 text-muted-foreground text-xs">({m.teamName})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-muted-foreground">
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
