import { verifyToken } from "./jwt";

export function authenticate(token: string) {
  return verifyToken(token);
}