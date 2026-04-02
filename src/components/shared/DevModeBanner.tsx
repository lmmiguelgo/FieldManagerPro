"use client";

import { IS_DEV_MODE } from "@/lib/dev-mode";

export function DevModeBanner() {
  if (!IS_DEV_MODE) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-1.5 text-xs font-semibold text-amber-950">
      <span>⚠ Dev Mode — mock data only.</span>
      <span className="opacity-70">Configure .env.local and restart to connect to Firebase.</span>
    </div>
  );
}
