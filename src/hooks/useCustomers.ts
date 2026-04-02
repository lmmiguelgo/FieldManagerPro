"use client";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IS_DEV_MODE } from "@/lib/dev-mode";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import type { Customer } from "@/types/customer";

export function useCustomers() {
  const [snapshot, loading, error] = useCollection(
    IS_DEV_MODE ? null : query(collection(db, "customers"), orderBy("companyName"))
  );

  if (IS_DEV_MODE) {
    return { customers: MOCK_CUSTOMERS, loading: false, error: undefined };
  }

  const customers: Customer[] = snapshot?.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Customer)
  ) ?? [];

  return { customers, loading, error };
}
