"use client";

import { useEffect } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { TicketStatusBadge } from "@/components/tickets/TicketStatusBadge";
import { TicketPriorityBadge } from "@/components/tickets/TicketPriorityBadge";
import { formatTime, formatShortDate } from "@/lib/utils/date";
import type { Ticket } from "@/types/ticket";

interface TicketDetailPanelProps {
  ticket: Ticket | null;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

export function TicketDetailPanel({ ticket, onClose }: TicketDetailPanelProps) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-200",
          ticket ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-zinc-900",
          ticket ? "translate-x-0" : "translate-x-full"
        )}
      >
        {ticket && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-200 p-5 dark:border-zinc-700">
              <div className="space-y-1 pr-4">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  {ticket.customerName}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  <TicketPriorityBadge priority={ticket.priority} />
                  <TicketStatusBadge status={ticket.status} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Description */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Description
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Date"
                  value={formatShortDate(ticket.scheduledDate.toDate())}
                />
                <Field
                  label="Time"
                  value={formatTime(ticket.scheduledTime)}
                />
                <Field
                  label="Duration"
                  value={`${ticket.estimatedDuration} min`}
                />
                <Field
                  label="Technician"
                  value={ticket.assignedTechnicianName ?? "Unassigned"}
                />
              </div>

              {/* Parts needed */}
              {ticket.partsNeeded && ticket.partsNeeded.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1">
                    Parts Needed
                  </p>
                  <ul className="space-y-1">
                    {ticket.partsNeeded.map((part, i) => (
                      <li
                        key={i}
                        className="text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        • {part}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-700 flex gap-2">
              <Link href={`/tickets/${ticket.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Full Ticket
                </Button>
              </Link>
              <Link href={`/tickets/${ticket.id}/edit`} className="flex-1">
                <Button className="w-full">Edit</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
