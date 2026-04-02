"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { clsx } from "clsx";
import { TicketCard } from "./TicketCard";
import type { Ticket } from "@/types/ticket";
import type { UserProfile } from "@/types/user";

// Deterministic color from name — cycles through a palette
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Max workload hours for the capacity bar (8h day)
const MAX_MINUTES = 480;

interface TechnicianColumnProps {
  technician: UserProfile;
  tickets: Ticket[];
}

export function TechnicianColumn({ technician, tickets }: TechnicianColumnProps) {
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
          {/* Avatar */}
          <div
            className={clsx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
              avatarColor(technician.displayName)
            )}
          >
            {initials(technician.displayName)}
          </div>

          {/* Name + role */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {technician.displayName}
            </p>
            <p className="text-xs capitalize text-zinc-400 dark:text-zinc-500">
              {technician.role.replace("_", " ")}
            </p>
          </div>

          {/* Ticket count */}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {tickets.length}
          </span>
        </div>

        {/* Workload bar — always rendered so column headers align with UnassignedPool */}
        {totalMinutes > 0 ? (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
              <span>
                {hours > 0 ? `${hours}h ` : ""}
                {mins > 0 ? `${mins}m` : ""} scheduled
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
              <span>Nothing scheduled</span>
              <span>0%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
        )}
      </div>

      {/* Drop zone */}
      <Droppable droppableId={`tech-${technician.uid}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              "flex min-h-24 flex-1 flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition-colors",
              snapshot.isDraggingOver
                ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                : "border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-900/30"
            )}
          >
            {tickets.length === 0 && !snapshot.isDraggingOver && (
              <p className="flex flex-1 items-center justify-center py-6 text-xs text-zinc-400 dark:text-zinc-600">
                No tickets · drag here to assign
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
