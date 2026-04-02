"use client";

import { useState } from "react";
import Link from "next/link";
import { useTickets } from "@/hooks/useTickets";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import type { TicketStatus } from "@/types/ticket";

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function TicketList() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const { tickets, loading } = useTickets(
    statusFilter ? { status: statusFilter } : {}
  );
  const { isAdmin } = useRole();

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-48">
          <Select
            id="statusFilter"
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "")}
          />
        </div>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description={
            statusFilter
              ? "No tickets match the selected status."
              : "Create your first service ticket to get started."
          }
          action={
            isAdmin ? (
              <Link href="/tickets/new">
                <Button size="sm">New Ticket</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Scheduled</TableHeader>
                <TableHeader>Technician</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-zinc-900 dark:text-white">
                    {ticket.customerName}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {ticket.description}
                  </TableCell>
                  <TableCell>
                    <TicketPriorityBadge priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <TicketStatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    {ticket.scheduledDate.toDate().toLocaleDateString()}{" "}
                    {ticket.scheduledTime}
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTechnicianName ?? (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/tickets/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      {isAdmin && (
                        <Link href={`/tickets/${ticket.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
