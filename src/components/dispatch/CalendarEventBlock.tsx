"use client";

import { clsx } from "clsx";
import type { Ticket } from "@/types/ticket";

const CALENDAR_START_HOUR = 6;
const HOUR_HEIGHT = 64; // px per hour

const priorityStyles: Record<Ticket["priority"], string> = {
  low: "bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-700/60 dark:border-zinc-500 dark:text-zinc-200",
  medium: "bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-200",
  high: "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-900/40 dark:border-amber-400 dark:text-amber-200",
  urgent: "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/40 dark:border-red-500 dark:text-red-200",
};

const priorityLeftBorder: Record<Ticket["priority"], string> = {
  low: "border-l-zinc-400",
  medium: "border-l-blue-500",
  high: "border-l-amber-500",
  urgent: "border-l-red-600",
};

export function getEventTop(scheduledTime: string): number {
  const [h, m] = scheduledTime.split(":").map(Number);
  const minutesFromStart = h * 60 + m - CALENDAR_START_HOUR * 60;
  return Math.max(0, (minutesFromStart / 60) * HOUR_HEIGHT);
}

export function getEventHeight(estimatedDuration: number): number {
  return Math.max(28, (estimatedDuration / 60) * HOUR_HEIGHT);
}

interface CalendarEventBlockProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export function CalendarEventBlock({ ticket, onClick }: CalendarEventBlockProps) {
  const top = getEventTop(ticket.scheduledTime);
  const height = getEventHeight(ticket.estimatedDuration);

  return (
    <button
      onClick={() => onClick(ticket)}
      style={{ top, height, left: 2, right: 2 }}
      className={clsx(
        "absolute rounded border border-l-2 px-1.5 py-1 text-left transition-opacity hover:opacity-80 overflow-hidden",
        priorityStyles[ticket.priority],
        priorityLeftBorder[ticket.priority]
      )}
    >
      <p className="text-xs font-semibold leading-tight truncate">
        {ticket.customerName}
      </p>
      {height >= 44 && (
        <p className="text-xs opacity-75 truncate leading-tight mt-0.5">
          {ticket.scheduledTime} · {ticket.estimatedDuration}m
        </p>
      )}
      {height >= 60 && (
        <p className="text-xs opacity-60 truncate leading-tight mt-0.5">
          {ticket.description}
        </p>
      )}
    </button>
  );
}
