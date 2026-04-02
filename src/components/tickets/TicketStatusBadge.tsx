import { Badge } from "@/components/ui/badge";
import type { TicketStatus } from "@/types/ticket";

const statusConfig: Record<
  TicketStatus,
  { label: string; color: "zinc" | "blue" | "amber" | "green" | "red" }
> = {
  unassigned: { label: "Unassigned", color: "zinc" },
  assigned: { label: "Assigned", color: "blue" },
  in_progress: { label: "In Progress", color: "amber" },
  completed: { label: "Completed", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { label, color } = statusConfig[status];
  return <Badge color={color}>{label}</Badge>;
}
