import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";

const SELECT_ROLE_PATH = "/auth/select-role";
const TUTOR_PENDING_PATH = "/tutor/pending";
const TUTOR_ONBOARDING_PATH = "/tutor/onboarding";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const isAuthPage = pathname.startsWith("/auth");
    const isSelectRolePage = pathname === SELECT_ROLE_PATH;
    const isSelectRoleApi = pathname.startsWith("/api/auth/select-role");
    const isProfileApi = pathname.startsWith("/api/user/profile");
    const isRegisterApi = pathname.startsWith("/api/register");
    const isAuthApi =
      pathname.startsWith("/api/auth/forgot-password") ||
      pathname.startsWith("/api/auth/reset-password") ||
      pathname.startsWith("/api/auth/verify-email");

    // Rate Limiting
    if (isAuthPage || isProfileApi || isRegisterApi || isAuthApi) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await rateLimit(ip);

      if (!success) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }

    // Allow the select-role API to pass through without a role check
    if (isSelectRoleApi) return null;

    if (isAuthPage && pathname !== "/auth/redirect") {
      // Let authenticated users visit select-role page even while logged in
      if (isAuth && !isSelectRolePage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    // If the user is authenticated but has no role yet, send them to select-role
    if (isAuth && !token?.role && !isSelectRolePage) {
      return NextResponse.redirect(new URL(SELECT_ROLE_PATH, req.url));
    }

    // Role-based protection
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (
      pathname.startsWith("/tutor") &&
      token?.role !== "TUTOR" &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Tutor vetting gate: PENDING or REJECTED tutors can only reach onboarding or pending page
    if (
      token?.role === "TUTOR" &&
      (token as any)?.tutorStatus !== "APPROVED" &&
      pathname.startsWith("/tutor") &&
      pathname !== TUTOR_PENDING_PATH &&
      pathname !== TUTOR_ONBOARDING_PATH &&
      !pathname.startsWith("/tutor/onboarding")
    ) {
      // Allow if still in onboarding (no tutorStatus yet means pre-submission)
      if ((token as any)?.tutorStatus === "PENDING" || (token as any)?.tutorStatus === "REJECTED") {
        return NextResponse.redirect(new URL(TUTOR_PENDING_PATH, req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        const isAuthPage = pathname.startsWith("/auth");
        const isProfileApi = pathname.startsWith("/api/user/profile");
        const isSelectRoleApi = pathname.startsWith("/api/auth/select-role");
        const isRegisterApi = pathname.startsWith("/api/register");
        const isAuthApi =
          pathname.startsWith("/api/auth/forgot-password") ||
          pathname.startsWith("/api/auth/reset-password") ||
          pathname.startsWith("/api/auth/verify-email");

        if (
          isAuthPage ||
          isProfileApi ||
          isSelectRoleApi ||
          isRegisterApi ||
          isAuthApi
        ) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/tutor/:path*",
    "/tracks/:path*",
    "/api/auth/select-role",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/verify-email",
    "/api/register",
    "/api/user/profile",
  ],
};
