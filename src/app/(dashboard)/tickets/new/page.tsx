import { Suspense } from "react";
import { TicketForm } from "@/components/tickets/TicketForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          New Ticket
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Create a new service ticket.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <Suspense fallback={<LoadingSpinner />}>
          <TicketForm />
        </Suspense>
      </div>
    </div>
  );
}
