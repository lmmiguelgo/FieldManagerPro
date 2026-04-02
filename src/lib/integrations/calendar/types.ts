export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  location?: string;
  attendees?: string[];
}

export interface CalendarProvider {
  listEvents(from: Date, to: Date): Promise<CalendarEvent[]>;
  createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent>;
  updateEvent(id: string, event: Partial<Omit<CalendarEvent, "id">>): Promise<void>;
  deleteEvent(id: string): Promise<void>;
}
