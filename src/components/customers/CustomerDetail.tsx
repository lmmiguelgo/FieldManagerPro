"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDocument, deleteDocument } from "@/lib/firebase/firestore";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Customer } from "@/types/customer";

export function CustomerDetail({ id }: { id: string }) {
  const router = useRouter();
  const { isAdmin } = useRole();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getDocument<Customer>("customers", id).then((doc) => {
      setCustomer(doc);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDocument("customers", id);
      router.push("/customers");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!customer) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Customer not found.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {customer.companyName}
              </h1>
              <Badge color={customer.isActive ? "green" : "zinc"}>
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Contact: {customer.contactName}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Link href={`/customers/${id}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setShowDelete(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard label="Email" value={customer.email} />
          <InfoCard label="Phone" value={customer.phone} />
          <InfoCard
            label="Address"
            value={`${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}`}
          />
          {customer.notes && (
            <InfoCard label="Notes" value={customer.notes} />
          )}
        </div>

        <div className="flex gap-2">
          <Link href="/customers">
            <Button variant="ghost" size="sm">
              ← Back to Customers
            </Button>
          </Link>
          <Link href={`/tickets/new?customerId=${id}&customerName=${encodeURIComponent(customer.companyName)}`}>
            <Button variant="secondary" size="sm">
              Create Ticket
            </Button>
          </Link>
        </div>
      </div>

      <Dialog open={showDelete} onClose={() => setShowDelete(false)}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Are you sure you want to delete{" "}
            <strong>{customer.companyName}</strong>? This action cannot be
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
