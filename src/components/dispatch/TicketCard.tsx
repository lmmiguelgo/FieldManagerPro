"use client";

import { clsx } from "clsx";
import { TicketStatusBadge } from "@/components/tickets/TicketStatusBadge";
import { TicketPriorityBadge } from "@/components/tickets/TicketPriorityBadge";
import type { Ticket } from "@/types/ticket";

const priorityBorder: Record<Ticket["priority"], string> = {
  low: "border-l-zinc-300 dark:border-l-zinc-600",
  medium: "border-l-blue-400",
  high: "border-l-amber-400",
  urgent: "border-l-red-500",
};

interface TicketCardProps {
  ticket: Ticket;
  isDragging: boolean;
}

export function TicketCard({ ticket, isDragging }: TicketCardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-l-4 bg-white p-3 dark:bg-zinc-800",
        "border-zinc-200 dark:border-zinc-700",
        priorityBorder[ticket.priority],
        isDragging && "shadow-lg ring-2 ring-zinc-900/10 dark:ring-white/10"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
          {ticket.customerName}
        </p>
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
          {ticket.scheduledTime}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
        {ticket.description}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <TicketPriorityBadge priority={ticket.priority} />
        <TicketStatusBadge status={ticket.status} />
        {ticket.estimatedDuration && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {ticket.estimatedDuration}m
          </span>
        )}
      </div>
    </div>
  );
}
