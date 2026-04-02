"use client";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IS_DEV_MODE } from "@/lib/dev-mode";
import { MOCK_TICKETS } from "@/lib/mock-data";
import { getWeekDays } from "@/lib/utils/date";
import type { Ticket } from "@/types/ticket";

export function useTicketsByWeek(anyDateInWeek: Date) {
  const weekDays = getWeekDays(anyDateInWeek);
  const start = new Date(weekDays[0]);
  start.setHours(0, 0, 0, 0);
  const end = new Date(weekDays[6]);
  end.setHours(23, 59, 59, 999);

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

  if (IS_DEV_MODE) {
    return { tickets: MOCK_TICKETS, weekDays, loading: false, error: undefined };
  }

  const tickets: Ticket[] = snapshot?.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Ticket)
  ) ?? [];

  return { tickets, weekDays, loading, error };
}
