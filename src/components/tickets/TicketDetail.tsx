"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDocument, deleteDocument } from "@/lib/firebase/firestore";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import type { Ticket } from "@/types/ticket";

export function TicketDetail({ id }: { id: string }) {
  const router = useRouter();
  const { isAdmin } = useRole();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getDocument<Ticket>("tickets", id).then((doc) => {
      setTicket(doc);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDocument("tickets", id);
      router.push("/tickets");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!ticket) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Ticket not found.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {ticket.customerName}
              </h1>
              <TicketPriorityBadge priority={ticket.priority} />
              <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {ticket.description}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Link href={`/tickets/${id}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setShowDelete(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            label="Scheduled"
            value={`${ticket.scheduledDate.toDate().toLocaleDateString()} at ${ticket.scheduledTime}`}
          />
          <InfoCard
            label="Duration"
            value={`${ticket.estimatedDuration} minutes`}
          />
          <InfoCard
            label="Technician"
            value={ticket.assignedTechnicianName ?? "Unassigned"}
          />
          <InfoCard label="Customer" value={ticket.customerName} />
        </div>

        <div className="flex gap-2">
          <Link href="/tickets">
            <Button variant="ghost" size="sm">
              ← Back to Tickets
            </Button>
          </Link>
          {ticket.status !== "completed" && ticket.status !== "cancelled" && (
            <Link href={`/reports/new?ticketId=${id}`}>
              <Button variant="secondary" size="sm">
                Create Report
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Dialog open={showDelete} onClose={() => setShowDelete(false)}>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </p>
        </DialogBody>
        <DialogActions>
          <Button
            variant="outline"
            onClick={() => setShowDelete(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-sm text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}
