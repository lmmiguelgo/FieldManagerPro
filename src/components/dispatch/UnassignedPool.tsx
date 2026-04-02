"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { clsx } from "clsx";
import { TicketCard } from "./TicketCard";
import type { Ticket } from "@/types/ticket";

// Match TechnicianColumn capacity scale for the bar
const MAX_MINUTES = 480;

interface UnassignedPoolProps {
  tickets: Ticket[];
}

export function UnassignedPool({ tickets }: UnassignedPoolProps) {
  const totalMinutes = tickets.reduce((sum, t) => sum + (t.estimatedDuration ?? 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const capacityPct = Math.min(100, Math.round((totalMinutes / MAX_MINUTES) * 100));
  const overloaded = totalMinutes > MAX_MINUTES;

  return (
    <div className="flex w-72 shrink-0 flex-col">
      {/* Column header */}
      <div className="mb-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg className="h-4 w-4 text-zinc-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            </svg>
          </div>

          {/* Label */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Unassigned
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Drag to a technician
            </p>
          </div>

          {/* Count */}
          <span
            className={clsx(
              "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
              tickets.length > 0
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            )}
          >
            {tickets.length}
          </span>
        </div>

        {/* Workload block — same structure as TechnicianColumn for aligned header height */}
        {totalMinutes > 0 ? (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
              <span>
                {hours > 0 ? `${hours}h ` : ""}
                {mins > 0 ? `${mins}m` : ""} estimated
              </span>
              <span className={clsx(overloaded ? "font-semibold text-red-500" : "")}>
                {capacityPct}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={clsx(
                  "h-full rounded-full transition-all",
                  overloaded
                    ? "bg-red-500"
                    : capacityPct >= 75
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                )}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <div className="mb-1 flex h-[18px] items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
              <span>No time estimated</span>
              <span>0%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
        )}
      </div>

      {/* Drop zone */}
      <Droppable droppableId="unassigned">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              "flex min-h-24 flex-1 flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition-colors",
              snapshot.isDraggingOver
                ? "border-zinc-400 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800"
                : "border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-900/30"
            )}
          >
            {tickets.length === 0 && !snapshot.isDraggingOver && (
              <p className="flex flex-1 items-center justify-center py-6 text-xs text-zinc-400 dark:text-zinc-600">
                All tickets assigned
              </p>
            )}
            {tickets.map((ticket, index) => (
              <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TicketCard ticket={ticket} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
