"use client";

import { useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IS_DEV_MODE } from "@/lib/dev-mode";
import { MOCK_TICKETS } from "@/lib/mock-data";
import type { Ticket } from "@/types/ticket";

export function useTicketsByDate(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  // Stable numbers for memo deps — avoid new Date objects on every render
  const startMs = start.getTime();
  const endMs = end.getTime();

  const [snapshot, loading, error] = useCollection(
    IS_DEV_MODE
      ? null
      : query(
          collection(db, "tickets"),
          where("scheduledDate", ">=", Timestamp.fromDate(start)),
          where("scheduledDate", "<=", Timestamp.fromDate(end)),
          orderBy("scheduledDate", "asc")
        )
  );

  const devTickets = useMemo(() => {
    if (!IS_DEV_MODE) return [];
    return MOCK_TICKETS.filter((t) => {
      const ms = t.scheduledDate.toDate().getTime();
      return ms >= startMs && ms <= endMs;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMs, endMs]);

  if (IS_DEV_MODE) {
    return { tickets: devTickets, loading: false, error: undefined };
  }

  const tickets: Ticket[] = snapshot?.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Ticket)
  ) ?? [];

  return { tickets, loading, error };
}
