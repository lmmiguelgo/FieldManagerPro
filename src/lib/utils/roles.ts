import { type UserRole } from "@/types/roles";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  technician: 1,
  admin: 2,
  global_admin: 3,
};

export function hasMinRole(
  userRole: UserRole | null,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isAdmin(role: UserRole | null): boolean {
  return hasMinRole(role, "admin");
}

export function isGlobalAdmin(role: UserRole | null): boolean {
  return hasMinRole(role, "global_admin");
}

// Route-to-minimum-role mapping for middleware
export const ROUTE_ROLES: Record<string, UserRole> = {
  "/dispatch": "admin",
  "/parts": "admin",
  "/quickbooks": "admin",
  "/admin": "global_admin",
};
