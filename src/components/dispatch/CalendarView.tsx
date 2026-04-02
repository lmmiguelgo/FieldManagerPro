"use client";

import { useRef, useEffect } from "react";
import { clsx } from "clsx";
import { useTicketsByWeek } from "@/hooks/useTicketsByWeek";
import { CalendarEventBlock } from "./CalendarEventBlock";
import { TicketDetailPanel } from "./TicketDetailPanel";
import {
  isSameDay,
  isToday,
  formatWeekday,
  formatShortDate,
  formatHour,
} from "@/lib/utils/date";
import { useState } from "react";
import type { Ticket } from "@/types/ticket";

const CALENDAR_START_HOUR = 6;
const CALENDAR_END_HOUR = 20; // 8 PM
const HOUR_HEIGHT = 64;
const HOURS = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
  (_, i) => CALENDAR_START_HOUR + i
);

interface CalendarViewProps {
  selectedDate: Date;
}

export function CalendarView({ selectedDate }: CalendarViewProps) {
  const { tickets, weekDays } = useTicketsByWeek(selectedDate);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to 7 AM on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = HOUR_HEIGHT; // 1 hour from 6 AM = 7 AM
    }
  }, []);

  function getTicketsForDay(day: Date): Ticket[] {
    return tickets.filter((t) => isSameDay(t.scheduledDate.toDate(), day));
  }

  const totalHeight = HOURS.length * HOUR_HEIGHT;

  // Minimum total grid width: gutter + 7 columns × 80px
  const MIN_COL_WIDTH = 80;
  const GUTTER_WIDTH = 48;

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        {/* Outer horizontal scroll wrapper */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: GUTTER_WIDTH + 7 * MIN_COL_WIDTH }}>

            {/* Day headers */}
            <div className="flex border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              {/* Time gutter */}
              <div style={{ width: GUTTER_WIDTH }} className="shrink-0" />
              {weekDays.map((day) => {
                const today = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className="flex flex-1 flex-col items-center border-l border-zinc-100 py-2 dark:border-zinc-800"
                    style={{ minWidth: MIN_COL_WIDTH }}
                  >
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {formatWeekday(day)}
                    </span>
                    <span
                      className={clsx(
                        "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                        today
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "text-zinc-900 dark:text-white"
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Scrollable time grid */}
            <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 560 }}>
              <div className="flex" style={{ height: totalHeight }}>
                {/* Time labels gutter */}
                <div style={{ width: GUTTER_WIDTH }} className="shrink-0">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="flex items-start justify-end pr-2"
                      style={{ height: HOUR_HEIGHT }}
                    >
                      <span className="mt-[-8px] text-xs text-zinc-400 dark:text-zinc-500">
                        {formatHour(hour)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {weekDays.map((day) => {
                  const dayTickets = getTicketsForDay(day);
                  const today = isToday(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className="relative flex-1 border-l border-zinc-100 dark:border-zinc-800"
                      style={{ minWidth: MIN_COL_WIDTH }}
                    >
                      {/* Today highlight */}
                      {today && (
                        <div className="absolute inset-0 bg-blue-50/40 dark:bg-blue-900/10 pointer-events-none" />
                      )}

                      {/* Hour lines */}
                      {HOURS.map((hour, i) => (
                        <div
                          key={hour}
                          className="absolute w-full border-t border-zinc-100 dark:border-zinc-800"
                          style={{ top: i * HOUR_HEIGHT }}
                        />
                      ))}

                      {/* Half-hour lines */}
                      {HOURS.map((hour, i) => (
                        <div
                          key={`half-${hour}`}
                          className="absolute w-full border-t border-dashed border-zinc-50 dark:border-zinc-800/50"
                          style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                        />
                      ))}

                      {/* Events */}
                      {dayTickets.map((ticket) => (
                        <CalendarEventBlock
                          key={ticket.id}
                          ticket={ticket}
                          onClick={setSelectedTicket}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <TicketDetailPanel
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}
