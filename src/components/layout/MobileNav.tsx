"use client";

import { useEffect } from "react";
import { AppSidebar } from "./AppSidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      {/* Sidebar panel */}
      <div className="fixed inset-y-0 left-0 w-72 shadow-xl">
        <AppSidebar onClose={onClose} />
      </div>
    </div>
  );
}
