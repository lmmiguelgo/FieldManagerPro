import { z } from "zod";

export const TicketFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string().min(1),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum([
    "unassigned",
    "assigned",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  assignedTechnicianId: z.string().optional(),
  assignedTechnicianName: z.string().optional(),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  estimatedDuration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 minute"),
  partsNeeded: z.array(z.string()).optional(),
});

export type TicketFormData = z.infer<typeof TicketFormSchema>;
