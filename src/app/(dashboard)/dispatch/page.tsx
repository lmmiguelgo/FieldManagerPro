import { DispatchBoard } from "@/components/dispatch/DispatchBoard";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Dispatch
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Drag tickets onto technicians to assign and schedule work.
        </p>
      </div>
      <ClientOnly fallback={<LoadingSpinner className="py-20" />}>
        <DispatchBoard />
      </ClientOnly>
    </div>
  );
}
