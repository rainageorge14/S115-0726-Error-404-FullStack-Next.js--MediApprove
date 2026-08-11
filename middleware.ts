import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded?.id || decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired authentication token",
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/medicines/:path*",
    "/api/dashboard/:path*",
    "/api/notifications/:path*",
  ],
};