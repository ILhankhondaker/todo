import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  filtered: boolean;
}

export function EmptyState({ filtered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
      <ClipboardList className="h-12 w-12 mb-4 opacity-30" />
      {filtered ? (
        <>
          <p className="font-medium">No tasks match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </>
      ) : (
        <>
          <p className="font-medium">No tasks yet</p>
          <p className="text-sm mt-1">Add your first task to get started</p>
        </>
      )}
    </div>
  );
}
