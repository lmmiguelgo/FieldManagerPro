"use client";

import { useRole } from "@/hooks/useRole";
import { type UserRole } from "@/types/roles";
import { hasMinRole } from "@/lib/utils/roles";
import { type ReactNode } from "react";

interface RoleGateProps {
  minRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({ minRole, children, fallback = null }: RoleGateProps) {
  const { role } = useRole();

  if (!hasMinRole(role, minRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
