import { NextRequest, NextResponse } from "next/server";

function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  const isApi = pathname.startsWith("/api");

  if (!token) {
    if (isApi) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  const user = decodeJwt(token);
  if (!user) {
    if (isApi) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Define Admin-only page routes
  const adminOnlyPages = [
    "/dashboard/pending",
    "/dashboard/approved",
    "/dashboard/rejected",
    "/dashboard/reports",
    "/dashboard/action-logs",
    "/dashboard/settings",
  ];

  // Define Admin-only APIs
  const isAdminOnlyApi =
    isApi &&
    (pathname.startsWith("/api/admin") ||
      pathname.endsWith("/approve") ||
      pathname.endsWith("/reject") ||
      pathname === "/api/medicines/pending");

  const isAdminOnlyPage = adminOnlyPages.some(
    (page) => pathname === page || pathname.startsWith(page + "/")
  );

  if (isAdminOnlyPage || isAdminOnlyApi) {
    if (user.role !== "ADMIN") {
      if (isApi) {
        return NextResponse.json(
          {
            success: false,
            message: "Forbidden",
          },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/medicines/:path*",
    "/api/dashboard/:path*",
    "/api/notifications/:path*",
    "/dashboard/:path*",
  ],
};