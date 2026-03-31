import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type QueryConstraint,
  type WithFieldValue,
  type UpdateData,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// Typed collection reference
export function typedCollection<T extends DocumentData>(path: string) {
  return collection(db, path);
}

// Typed document reference
export function typedDoc<T extends DocumentData>(
  collectionPath: string,
  docId: string
) {
  return doc(db, collectionPath, docId);
}

// Add a document with auto-generated ID
export async function addDocument<T extends DocumentData>(
  collectionPath: string,
  data: WithFieldValue<T>
) {
  const ref = collection(db, collectionPath);
  return addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Update an existing document
export async function updateDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string,
  data: UpdateData<T>
) {
  const ref = doc(db, collectionPath, docId);
  return updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a document
export async function deleteDocument(collectionPath: string, docId: string) {
  const ref = doc(db, collectionPath, docId);
  return deleteDoc(ref);
}

// Get a single document
export async function getDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string
) {
  const ref = doc(db, collectionPath, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

// Query documents
export async function queryDocuments<T extends DocumentData>(
  collectionPath: string,
  ...constraints: QueryConstraint[]
) {
  const ref = collection(db, collectionPath);
  const q = query(ref, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
}

// Re-export commonly used Firestore utilities
export {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
};
