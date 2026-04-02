"use client";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, where, type QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IS_DEV_MODE } from "@/lib/dev-mode";
import { MOCK_TICKETS } from "@/lib/mock-data";
import type { Ticket, TicketStatus } from "@/types/ticket";

interface UseTicketsOptions {
  status?: TicketStatus;
  technicianId?: string;
}

export function useTickets(options: UseTicketsOptions = {}) {
  const constraints: QueryConstraint[] = [orderBy("scheduledDate", "asc")];

  if (options.status) {
    constraints.push(where("status", "==", options.status));
  }
  if (options.technicianId) {
    constraints.push(where("assignedTechnicianId", "==", options.technicianId));
  }

  const [snapshot, loading, error] = useCollection(
    IS_DEV_MODE ? null : query(collection(db, "tickets"), ...constraints)
  );

  if (IS_DEV_MODE) {
    const tickets = MOCK_TICKETS.filter((t) => {
      if (options.status && t.status !== options.status) return false;
      if (options.technicianId && t.assignedTechnicianId !== options.technicianId) return false;
      return true;
    });
    return { tickets, loading: false, error: undefined };
  }

  const tickets: Ticket[] = snapshot?.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Ticket)
  ) ?? [];

  return { tickets, loading, error };
}
