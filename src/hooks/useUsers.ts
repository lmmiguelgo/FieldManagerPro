"use client";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IS_DEV_MODE } from "@/lib/dev-mode";
import { MOCK_USERS } from "@/lib/mock-data";
import type { UserProfile } from "@/types/user";

export function useUsers() {
  const [snapshot, loading, error] = useCollection(
    IS_DEV_MODE ? null : query(collection(db, "users"), where("isActive", "==", true))
  );

  if (IS_DEV_MODE) {
    const users = MOCK_USERS;
    const technicians = users.filter(
      (u) => u.role === "technician" || u.role === "admin"
    );
    return { users, technicians, loading: false, error: undefined };
  }

  const users: UserProfile[] = snapshot?.docs.map(
    (doc) => ({ uid: doc.id, ...doc.data() } as UserProfile)
  ) ?? [];

  const technicians = users.filter(
    (u) => u.role === "technician" || u.role === "admin"
  );

  return { users, technicians, loading, error };
}
