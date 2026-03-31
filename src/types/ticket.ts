import { type Timestamp } from "firebase/firestore";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus =
  | "unassigned"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  scheduledDate: Timestamp;
  scheduledTime: string;
  estimatedDuration: number;
  partsNeeded?: string[];
  serviceReportId?: string;
  exportedAt?: Timestamp;
  exportBatchId?: string;
  retentionWarning?: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
