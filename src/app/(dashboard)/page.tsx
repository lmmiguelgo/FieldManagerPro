"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { role, isAdmin } = useRole();

  if (loading) {
    return <LoadingSpinner className="mt-20" size="lg" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Welcome back{user?.displayName ? `, ${user.displayName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {isAdmin
          ? "Manage your field operations from here."
          : "View your assignments and track your work."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Open Tickets"
          value="--"
          description="Active jobs"
        />
        <DashboardCard
          title="Today's Agenda"
          value="--"
          description="Scheduled for today"
        />
        <DashboardCard
          title="Pending Reports"
          value="--"
          description="Awaiting completion"
        />
        <DashboardCard
          title="Active Trips"
          value="--"
          description="Mileage tracking"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
        {description}
      </p>
    </div>
  );
}
