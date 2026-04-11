"use client";

import { useState, useMemo } from "react";
import { Plus, Users, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { FilterBar } from "@/components/tasks/FilterBar";
import { StatsBar } from "@/components/tasks/StatsBar";
import { EmptyState } from "@/components/tasks/EmptyState";
import { TeamManager } from "@/components/teams/TeamManager";
import { useAppStore } from "@/hooks/useAppStore";
import type { Task, FilterState } from "@/types";

const DEFAULT_FILTERS: FilterState = {
  priority: "all",
  status: "all",
  assignedTo: "all",
  search: "",
};

export default function HomePage() {
  const {
    tasks, teams, isLoaded,
    addTask, updateTask, deleteTask, toggleTaskStatus,
    addTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember,
  } = useAppStore();

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [teamManagerOpen, setTeamManagerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.priority !== "all" && task.priority !== filters.priority) return false;
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (filters.assignedTo !== "all" && task.assignedTo !== filters.assignedTo) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filters]);

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  function openEdit(task: Task) {
    setEditingTask(task);
    setTaskFormOpen(true);
  }

  function handleFormSubmit(data: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  }

  function handleFormClose() {
    setTaskFormOpen(false);
    setEditingTask(undefined);
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const isFiltered =
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.assignedTo !== "all" ||
    filters.search !== "";

  return (
    <div className="min-h-screen bg-background">
   
   
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setTeamManagerOpen(true)} className="gap-1.5">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Teams</span>
              {teams.length > 0 && <span className="text-xs text-muted-foreground">({teams.length})</span>}
            </Button>
            <Button size="sm" onClick={() => setTaskFormOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        <StatsBar tasks={tasks} />
        <FilterBar filters={filters} onChange={setFilters} teams={teams} />

        <Tabs defaultValue="pending">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">
              Pending
              {pendingTasks.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {pendingTasks.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 sm:flex-none">
              Completed
              {completedTasks.length > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium">
                  {completedTasks.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {pendingTasks.length === 0 ? (
              <EmptyState filtered={isFiltered} />
            ) : (
              pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} teams={teams}
                  onToggle={toggleTaskStatus} onEdit={openEdit} onDelete={deleteTask} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedTasks.length === 0 ? (
              <EmptyState filtered={isFiltered} />
            ) : (
              completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} teams={teams}
                  onToggle={toggleTaskStatus} onEdit={openEdit} onDelete={deleteTask} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <TaskForm open={taskFormOpen} onClose={handleFormClose} onSubmit={handleFormSubmit}
        teams={teams} initialData={editingTask} />

      <TeamManager open={teamManagerOpen} onClose={() => setTeamManagerOpen(false)}
        teams={teams} onAddTeam={addTeam} onUpdateTeam={updateTeam} onDeleteTeam={deleteTeam}
        onAddMember={addTeamMember} onRemoveMember={removeTeamMember} />

        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia nostrum pariatur natus doloribus ullam. Molestias velit fuga enim, dolores sunt praesentium temporibus voluptatum dicta tempore fugiat, ex possimus assumenda, culpa recusandae quidem placeat inventore officia vel repudiandae corporis harum. Corrupti, suscipit nam! Earum recusandae, rem veniam et, illum dolorum aliquid quidem aliquam consequuntur similique, assumenda fuga dolores? Nostrum illum eum voluptates qui ad excepturi tempora omnis accusantium consectetur ducimus nobis, quod quam nemo. Modi illo porro, exercitationem molestias sint mollitia placeat vel. Ad, quia possimus vitae nesciunt enim nisi voluptas explicabo molestias assumenda temporibus iusto maxime nulla, dolores incidunt vel mollitia cupiditate doloribus labore obcaecati perspiciatis rerum nostrum! Dignissimos, error consequuntur. Doloribus sed omnis aperiam voluptas autem veritatis hic dolorum maxime accusantium, modi magnam dolores repellat, minima, corrupti a corporis ipsam rem pariatur! Dolorem saepe quas quibusdam animi odit tempora! Porro voluptatem enim, molestias laudantium earum hic nostrum labore nihil odio natus, quod recusandae numquam alias incidunt consectetur eaque? Rerum facere provident labore doloremque deserunt quam, voluptatum ad nemo exercitationem laboriosam, omnis quo illo dolorum. Explicabo iste natus et tempore molestias perferendis, vero ea dignissimos sapiente eveniet ipsa nobis consequatur reiciendis unde aut? Eos officiis architecto consequuntur enim ipsam aliquam praesentium quam reiciendis unde delectus harum provident dolore, iure, exercitationem repudiandae obcaecati fugiat tenetur deserunt placeat ducimus. Rerum quasi, fugiat quam, asperiores repellendus commodi at labore ex iusto nobis adipisci aperiam quibusdam repudiandae animi odit voluptate aut, assumenda autem. Ipsa error facilis enim quam omnis sapiente placeat asperiores sequi exercitationem nihil. Laborum ut esse minus labore illum neque hic voluptatibus libero, ab velit deleniti ea repellat, ipsam qui nemo! Dolor eligendi officiis aperiam inventore, cum eaque sint autem unde expedita libero officia odit dolorum quidem ducimus explicabo? Beatae harum libero exercitationem dicta quasi animi natus neque ipsa, iusto nulla repudiandae vitae numquam vero error, atque temporibus quis, mollitia nesciunt consequatur accusamus! Porro ducimus aperiam ullam praesentium perspiciatis quibusdam veniam, dolores error incidunt blanditiis voluptatum itaque fugiat deleniti esse saepe assumenda magnam libero consequuntur voluptatibus excepturi sed odio. Ipsa odit alias maiores voluptatum laborum, eius dolores odio enim saepe consectetur quae labore qui aliquid hic et, sunt nihil tempore unde voluptates repellendus veritatis praesentium. Veritatis officiis quo officia dolor eligendi obcaecati maxime ea perferendis et a voluptatem quis praesentium debitis totam sed voluptate omnis minus soluta consequuntur, explicabo harum tempora earum mollitia! Cum, fugiat architecto accusantium sit, ea ab eligendi ducimus animi magnam voluptatem recusandae quidem molestias aut quisquam neque ad doloremque veniam voluptate eius. Sunt excepturi reiciendis hic quia illo fugiat quod exercitationem expedita iure asperiores, dignissimos architecto, molestiae dolorum ipsum nesciunt sit mollitia et quas doloribus voluptatum! Impedit nam, dignissimos veniam exercitationem consequuntur illo animi, totam soluta odio quasi eligendi repellat reiciendis fuga distinctio harum quas aut nostrum veritatis ipsa corrupti obcaecati doloremque, nulla tempora ut? Nemo consequuntur, ducimus nulla eligendi maiores voluptate quis non inventore tenetur repellat odio distinctio nihil perspiciatis reiciendis id, odit tempora tempore rerum? Minima neque aspernatur dicta deserunt odit esse ratione sed ea accusamus.</p>
    </div>
  );
}
