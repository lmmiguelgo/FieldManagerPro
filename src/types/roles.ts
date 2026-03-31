export type UserRole = "global_admin" | "admin" | "technician";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole | null;
}
