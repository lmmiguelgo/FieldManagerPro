import {
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  where,
  orderBy,
  Timestamp,
} from "@/lib/firebase/firestore";
import type { CalendarEvent, CalendarProvider } from "./types";

interface StoredEvent {
  title: string;
  description?: string;
  startAt: ReturnType<typeof Timestamp.fromDate>;
  endAt: ReturnType<typeof Timestamp.fromDate>;
  location?: string;
  attendees?: string[];
}

function toCalendarEvent(doc: StoredEvent & { id: string }): CalendarEvent {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    startAt: doc.startAt.toDate(),
    endAt: doc.endAt.toDate(),
    location: doc.location,
    attendees: doc.attendees,
  };
}

export const internalCalendarProvider: CalendarProvider = {
  async listEvents(from, to) {
    const docs = await queryDocuments<StoredEvent>(
      "calendarEvents",
      where("startAt", ">=", Timestamp.fromDate(from)),
      where("startAt", "<=", Timestamp.fromDate(to)),
      orderBy("startAt", "asc")
    );
    return docs.map(toCalendarEvent);
  },

  async createEvent(event) {
    const ref = await addDocument("calendarEvents", {
      ...event,
      startAt: Timestamp.fromDate(event.startAt),
      endAt: Timestamp.fromDate(event.endAt),
    });
    return { id: ref.id, ...event };
  },

  async updateEvent(id, event) {
    const update: Partial<StoredEvent> = { ...event } as Partial<StoredEvent>;
    if (event.startAt) update.startAt = Timestamp.fromDate(event.startAt);
    if (event.endAt) update.endAt = Timestamp.fromDate(event.endAt);
    await updateDocument("calendarEvents", id, update);
  },

  async deleteEvent(id) {
    await deleteDocument("calendarEvents", id);
  },
};
