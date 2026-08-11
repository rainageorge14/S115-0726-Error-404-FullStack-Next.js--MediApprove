import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password } = parsed.data;

    // Check if email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "An administrator with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine role based on email domain automatically
    const role = email.toLowerCase().endsWith("@mediapprove.com") ? "ADMIN" : "USER";

    // Create user in the database
    const admin = await prisma.user.create({
      data: {
        name: fullName,
        email,
        phone,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
