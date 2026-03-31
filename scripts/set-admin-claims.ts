/**
 * Bootstrap script to set the first global_admin user.
 *
 * Usage:
 *   npx ts-node --esm scripts/set-admin-claims.ts <user-email>
 *
 * Requires FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY,
 * and NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variables.
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const email = process.argv[2];

if (!email) {
  console.error("Usage: npx ts-node scripts/set-admin-claims.ts <user-email>");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

async function main() {
  const auth = getAuth(app);

  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role: "global_admin" });
    console.log(`Successfully set global_admin role for ${email} (${user.uid})`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
