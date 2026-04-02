import { Badge } from "@/components/ui/badge";
import type { TicketPriority } from "@/types/ticket";

const priorityConfig: Record<
  TicketPriority,
  { label: string; color: "zinc" | "blue" | "amber" | "red" }
> = {
  low: { label: "Low", color: "zinc" },
  medium: { label: "Medium", color: "blue" },
  high: { label: "High", color: "amber" },
  urgent: { label: "Urgent", color: "red" },
};

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, color } = priorityConfig[priority];
  return <Badge color={color}>{label}</Badge>;
}
