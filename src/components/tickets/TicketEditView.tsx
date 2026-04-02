"use client";

import { useEffect, useState } from "react";
import { getDocument } from "@/lib/firebase/firestore";
import { TicketForm } from "./TicketForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Ticket } from "@/types/ticket";

export function TicketEditView({ id }: { id: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocument<Ticket>("tickets", id).then((doc) => {
      setTicket(doc);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!ticket) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Ticket not found.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Edit Ticket
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {ticket.customerName}
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <TicketForm ticket={ticket} />
      </div>
    </div>
  );
}
