import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET as string);
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload format");
  }
  return decoded as AuthTokenPayload;
}