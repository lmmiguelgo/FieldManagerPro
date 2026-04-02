"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { type UserRole, type AuthUser } from "@/types/roles";
import { IS_DEV_MODE } from "@/lib/dev-mode";

const MOCK_USER: AuthUser = {
  uid: "mock-admin-uid",
  email: "admin@fieldmanager.dev",
  displayName: "Dev Admin",
  role: "global_admin",
};

interface AuthContextValue {
  user: AuthUser | null;
  firebaseUser: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(IS_DEV_MODE ? MOCK_USER : null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!IS_DEV_MODE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (IS_DEV_MODE) return;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser) => {
        try {
          if (fbUser) {
            const tokenResult = await fbUser.getIdTokenResult();
            const role = (tokenResult.claims.role as UserRole) ?? null;

            setFirebaseUser(fbUser);
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
              role,
            });
          } else {
            setFirebaseUser(null);
            setUser(null);
          }
        } catch (err) {
          setError(
            err instanceof Error ? err : new Error("Authentication error")
          );
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
