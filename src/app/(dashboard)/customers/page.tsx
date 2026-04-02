import Link from "next/link";
import { CustomerList } from "@/components/customers/CustomerList";
import { RoleGate } from "@/components/layout/RoleGate";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Customers
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage customer accounts and contact information.
          </p>
        </div>
        <RoleGate minRole="admin">
          <Link href="/customers/new">
            <Button>Add Customer</Button>
          </Link>
        </RoleGate>
      </div>
      <ClientOnly fallback={<LoadingSpinner className="py-20" />}>
        <CustomerList />
      </ClientOnly>
    </div>
  );
}
