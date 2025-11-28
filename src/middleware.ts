import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
        const isProfileApi = req.nextUrl.pathname.startsWith("/api/user/profile");

        // Rate Limiting
        if (isAuthPage || isProfileApi) {
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

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return null;
        }

        if (!isAuth) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }

            return NextResponse.redirect(
                new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        // Role-based protection
        if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/tutor") && token?.role !== "TUTOR" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                if (req.nextUrl.pathname.startsWith("/auth")) return true;
                if (req.nextUrl.pathname.startsWith("/api/user/profile")) return true; // Allow middleware to handle auth check for API
                return !!token;
            },
        },
        pages: {
            signIn: "/auth/signin",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*", "/tutor/:path*"],
};
