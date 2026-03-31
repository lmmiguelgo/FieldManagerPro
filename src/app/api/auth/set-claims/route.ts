import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { type UserRole } from "@/types/roles";

const VALID_ROLES: UserRole[] = ["global_admin", "admin", "technician"];

export async function POST(request: NextRequest) {
  try {
    const { uid, role } = await request.json();

    if (!uid || !role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid uid or role" },
        { status: 400 }
      );
    }

    const auth = getAdminAuth();

    // Verify the requester is a global_admin
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (decodedToken.role !== "global_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Set the custom claim
    await auth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting claims:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
