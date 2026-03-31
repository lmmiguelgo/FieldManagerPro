import { NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  redirectToLogin,
  redirectToHome,
} from "next-firebase-auth-edge";

const PUBLIC_PATHS = ["/login", "/forgot-password"];

const ADMIN_PATHS = ["/dispatch", "/parts", "/quickbooks"];
const GLOBAL_ADMIN_PATHS = ["/admin"];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/auth/login",
    logoutPath: "/api/auth/logout",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: "AuthToken",
    cookieSignatureKeys: [
      process.env.FIREBASE_AUTH_COOKIE_SIGNATURE_KEY_CURRENT!,
      process.env.FIREBASE_AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!,
    ],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60, // 12 hours
    },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
        /\\n/g,
        "\n"
      ),
    },
    handleValidToken: async ({ token, decodedToken }, headers) => {
      const path = request.nextUrl.pathname;

      // If authenticated user tries to access login, redirect to dashboard
      if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
        return redirectToHome(request, { path: "/" });
      }

      const role = decodedToken.role as string | undefined;

      // Check global_admin routes
      if (GLOBAL_ADMIN_PATHS.some((p) => path.startsWith(p))) {
        if (role !== "global_admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      // Check admin routes
      if (ADMIN_PATHS.some((p) => path.startsWith(p))) {
        if (role !== "admin" && role !== "global_admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      return NextResponse.next({ headers });
    },
    handleInvalidToken: async (reason) => {
      const path = request.nextUrl.pathname;

      // Allow public paths
      if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
        return NextResponse.next();
      }

      // Allow API routes for cron jobs with secret header
      if (path.startsWith("/api/retention/purge")) {
        const cronSecret = request.headers.get("x-cron-secret");
        if (cronSecret === process.env.CRON_SECRET) {
          return NextResponse.next();
        }
      }

      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      console.error("Auth middleware error:", error);
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|icons|manifest.json|sw.js|.*\\.).*)",
    "/api/:path*",
  ],
};
