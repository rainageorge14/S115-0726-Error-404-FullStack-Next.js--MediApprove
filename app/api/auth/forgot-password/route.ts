import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, getPasswordResetTemplate } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Look up user (role doesn't matter, can be USER or ADMIN)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // If the user does not exist, return a generic message to prevent email enumeration
    const genericResponse = {
      success: true,
      message: "If an account with this email exists, a password reset link has been sent.",
    };

    if (!user) {
      return NextResponse.json(genericResponse);
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash token using SHA-256 for database storage
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Token expires in 15 minutes
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save hashed token and expiry date to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpires,
      },
    });

    // Build reset link (dynamic base URL)
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${protocol}://${host}`;
    const resetLink = `${origin}/reset-password?token=${rawToken}`;

    // Generate HTML template
    const htmlContent = getPasswordResetTemplate(user.name, resetLink);

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - MediApprove",
      html: htmlContent,
    });

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
