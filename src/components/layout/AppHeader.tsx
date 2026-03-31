"use client";

import { useAuth } from "@/hooks/useAuth";

interface AppHeaderProps {
  onMenuClick: () => void;
}

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 backdrop-blur-sm px-4 lg:hidden dark:border-zinc-700 dark:bg-zinc-900/80">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
      >
        <MenuIcon />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
          <span className="text-xs font-bold text-white dark:text-zinc-900">FM</span>
        </div>
        <span className="font-bold text-zinc-900 dark:text-white">
          Field Manager
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
          </span>
        </div>
      </div>
    </header>
  );
}
