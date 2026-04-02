"use client";

import { useState, useRef } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useTicketsByDate } from "@/hooks/useTicketsByDate";
import { useUsers } from "@/hooks/useUsers";
import { updateDocument } from "@/lib/firebase/firestore";
import { UnassignedPool } from "./UnassignedPool";
import { TechnicianColumn } from "./TechnicianColumn";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { addDays, isToday, formatLongDate } from "@/lib/utils/date";
import type { Ticket } from "@/types/ticket";

export function DispatchBoard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { tickets: fetchedTickets, loading } = useTicketsByDate(selectedDate);
  const { technicians } = useUsers();
  const [overrides, setOverrides] = useState<Record<string, Partial<Ticket>>>({});
  const dateInputRef = useRef<HTMLInputElement>(null);

  const tickets = fetchedTickets.map((t) =>
    overrides[t.id] ? { ...t, ...overrides[t.id] } : t
  );

  const unassignedTickets = tickets.filter(
    (t) => !t.assignedTechnicianId && t.status !== "completed" && t.status !== "cancelled"
  );
  const ticketsByTechnician = technicians.reduce<Record<string, Ticket[]>>(
    (acc, tech) => {
      acc[tech.uid] = tickets.filter((t) => t.assignedTechnicianId === tech.uid);
      return acc;
    },
    {}
  );

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = new Date(e.target.value + "T12:00:00");
    if (!isNaN(d.getTime())) setSelectedDate(d);
  }

  async function onDragEnd(result: DropResult) {
    const { draggableId, destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const ticket = tickets.find((t) => t.id === draggableId);
    if (!ticket) return;

    let update: Partial<Ticket>;
    if (destination.droppableId === "unassigned") {
      update = { assignedTechnicianId: undefined, assignedTechnicianName: undefined, status: "unassigned" };
    } else {
      const techId = destination.droppableId.replace("tech-", "");
      const tech = technicians.find((t) => t.uid === techId);
      update = { assignedTechnicianId: techId, assignedTechnicianName: tech?.displayName ?? "", status: "assigned" };
    }

    setOverrides((prev) => ({ ...prev, [draggableId]: { ...(prev[draggableId] ?? {}), ...update } }));
    await updateDocument("tickets", draggableId, {
      assignedTechnicianId: update.assignedTechnicianId ?? null,
      assignedTechnicianName: update.assignedTechnicianName ?? null,
      status: update.status,
    });
  }

  const today = isToday(selectedDate);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Prev day */}
        <Button variant="outline" size="sm" onClick={() => setSelectedDate((d) => addDays(d, -1))}>
          ←
        </Button>
        <button
            onClick={() => dateInputRef.current?.showPicker?.()}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
            title="Pick a date"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
          </button>

        {/* Date display + picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            {formatLongDate(selectedDate)}
          </span>
          {today && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Today
            </span>
          )}
          {/* Hidden native date input; triggered by the calendar icon button */}
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={handleDateChange}
            className="sr-only"
          />
          
        </div>

        {/* Next day */}
        <Button variant="outline" size="sm" onClick={() => setSelectedDate((d) => addDays(d, 1))}>
          →
        </Button>

        {/* Jump to today */}
        {!today && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
        )}

        {/* Summary */}
        <div className="ml-auto flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</span>
          {unassignedTickets.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {unassignedTickets.length} unassigned
            </span>
          )}
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <UnassignedPool tickets={unassignedTickets} />
          {technicians.map((tech) => (
            <TechnicianColumn
              key={tech.uid}
              technician={tech}
              tickets={ticketsByTechnician[tech.uid] ?? []}
            />
          ))}
          {technicians.length === 0 && (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              No technicians found. Add users with the technician role to see columns here.
            </p>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
