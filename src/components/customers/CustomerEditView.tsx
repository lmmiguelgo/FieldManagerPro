"use client";

import { useEffect, useState } from "react";
import { getDocument } from "@/lib/firebase/firestore";
import { CustomerForm } from "./CustomerForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Customer } from "@/types/customer";

export function CustomerEditView({ id }: { id: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocument<Customer>("customers", id).then((doc) => {
      setCustomer(doc);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!customer) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Customer not found.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Edit Customer
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {customer.companyName}
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <CustomerForm customer={customer} />
      </div>
    </div>
  );
}
