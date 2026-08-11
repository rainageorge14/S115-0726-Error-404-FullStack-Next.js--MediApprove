import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, AuthTokenPayload } from "./jwt";

/**
 * Retrieves the authenticated user from the request, verifying the JWT token.
 * Compatible with both NextRequest and standard Request.
 */
export async function getAuthUser(req: Request | NextRequest) {
  let token: string | undefined;

  // Try parsing cookies from NextRequest
  if ("cookies" in req && typeof (req as any).cookies?.get === "function") {
    token = (req as any).cookies.get("token")?.value;
  }

  // Fallback to cookie header parsing (standard Request)
  if (!token) {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;)\s*token\s*=\s*([^;]+)/);
    token = match ? match[1] : undefined;
  }

  if (!token) {
    return null;
  }

  let decoded: AuthTokenPayload;

  try {
    decoded = verifyToken(token);
  } catch {
    return null;
  }

  if (!decoded?.id) {
    return null;
  }

  // Fetch user from database using Prisma Client (model name is User, mapped to Admin table)
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return null;
  }

  // Check if token version matches (for invalidating old sessions via logout-all)
  if (user.tokenVersion !== (decoded.tokenVersion ?? 0)) {
    return null;
  }

  return user;
}

/**
 * Retrieves the authenticated user and ensures they have the ADMIN role.
 * Compatible with both NextRequest and standard Request.
 */
export async function getAuthenticatedAdmin(req: Request | NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}