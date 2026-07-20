import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: object) {
  console.log("Generating JWT with secret:", JWT_SECRET);

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string) {
  console.log("JWT Secret:", JWT_SECRET);
  console.log("Received Token:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw error;
  }
}