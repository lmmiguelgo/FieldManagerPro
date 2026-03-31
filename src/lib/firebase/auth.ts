import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "./config";

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();

  // Create session cookie via API route
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  return credential.user;
}

export async function signOut() {
  await fetch("/api/auth/session", { method: "DELETE" });
  await firebaseSignOut(auth);
}

export async function getUserRole(user: User): Promise<string | null> {
  const tokenResult = await user.getIdTokenResult();
  return (tokenResult.claims.role as string) ?? null;
}
