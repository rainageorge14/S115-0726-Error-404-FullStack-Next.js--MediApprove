import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required." },
        { status: 400 }
      );
    }

    // Password Validation checks
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least one uppercase letter." },
        { status: 400 }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least one lowercase letter." },
        { status: 400 }
      );
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least one number." },
        { status: 400 }
      );
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least one special character." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Hash incoming token using SHA-256 to compare with database
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Retrieve user by reset token
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: hashedToken },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid reset link." },
        { status: 400 }
      );
    }

    // Verify token expiration
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return NextResponse.json(
        { success: false, message: "Reset link has expired." },
        { status: 400 }
      );
    }

    // Hash new password using bcrypt
    const hashedPassword = await hashPassword(password);

    // Update password in database and clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
