"use client";

import { useAuth } from "@/providers/AuthProvider";
import { type UserRole } from "@/types/roles";
import { hasMinRole, isAdmin, isGlobalAdmin } from "@/lib/utils/roles";

export function useRole() {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    hasMinRole: (required: UserRole) => hasMinRole(role, required),
    isAdmin: isAdmin(role),
    isGlobalAdmin: isGlobalAdmin(role),
    isTechnician: role === "technician",
  };
}
