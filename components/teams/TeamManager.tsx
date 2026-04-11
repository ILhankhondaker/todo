"use client";

import { useState } from "react";
import { Plus, Trash2, UserPlus, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Team } from "@/types";

interface TeamManagerProps {
  open: boolean;
  onClose: () => void;
  teams: Team[];
  onAddTeam: (name: string) => void;
  onUpdateTeam: (id: string, name: string) => void;
  onDeleteTeam: (id: string) => void;
  onAddMember: (teamId: string, name: string) => void;
  onRemoveMember: (teamId: string, memberId: string) => void;
}

export function TeamManager({
  open,
  onClose,
  teams,
  onAddTeam,
  onDeleteTeam,
  onAddMember,
  onRemoveMember,
}: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState("");
  const [newMemberNames, setNewMemberNames] = useState<Record<string, string>>({});

  function handleAddTeam() {
    if (!newTeamName.trim()) return;
    onAddTeam(newTeamName.trim());
    setNewTeamName("");
  }

  function handleAddMember(teamId: string) {
    const name = newMemberNames[teamId]?.trim();
    if (!name) return;
    onAddMember(teamId, name);
    setNewMemberNames((prev) => ({ ...prev, [teamId]: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Teams
          </DialogTitle>
        </DialogHeader>

        {/* Create team */}
        <div className="space-y-1.5">
          <Label>New Team</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Team name…"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTeam()}
            />
            <Button onClick={handleAddTeam} disabled={!newTeamName.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Create
            </Button>
          </div>
        </div>

        <Separator />

        {teams.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            No teams yet. Create one above.
          </p>
        )}

        <ScrollArea className="max-h-[380px] pr-2">
          <div className="space-y-5">
            {teams.map((team) => (
              <div key={team.id} className="rounded-lg border p-4 space-y-3">
                {/* Team header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{team.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Members list */}
                {team.members.length > 0 && (
                  <div className="space-y-1.5">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5"
                      >
                        <span className="text-sm">{member.name}</span>
                        <button
                          onClick={() => onRemoveMember(team.id, member.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove member"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add member */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Member name…"
                    className="h-8 text-sm"
                    value={newMemberNames[team.id] ?? ""}
                    onChange={(e) =>
                      setNewMemberNames((prev) => ({
                        ...prev,
                        [team.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAddMember(team.id)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddMember(team.id)}
                    disabled={!newMemberNames[team.id]?.trim()}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
