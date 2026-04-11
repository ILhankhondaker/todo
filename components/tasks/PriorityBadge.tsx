import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
}

const config = {
  low: { label: "Low", variant: "success" as const },
  medium: { label: "Medium", variant: "warning" as const },
  high: { label: "High", variant: "danger" as const },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
}
