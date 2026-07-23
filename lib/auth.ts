import { verifyToken } from "./jwt";

export function authenticate(token: string) {
  return verifyToken(token);
}

export function getAuthUser(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;)\s*token\s*=\s*([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return null;
    const decoded = verifyToken(token);
    return decoded as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}