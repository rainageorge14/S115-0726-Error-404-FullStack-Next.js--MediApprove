import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { comparePassword } from "@/lib/hash";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(3, "Full Name must be at least 3 characters").optional(),
  email: z.string().email("Invalid Email Address").optional(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number format").optional().or(z.literal("")),
  timeFormat: z.enum(["12h", "24h"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        name: true,
        email: true,
        phone: true,
        role: true,
        timeFormat: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || "Not Added",
        role: dbUser.role,
        timeFormat: dbUser.timeFormat,
      },
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, timeFormat } = parsed.data;

    // Check if email is already in use by another user
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
          NOT: {
            id: authUser.id,
          },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: "Email address is already in use by another account." },
          { status: 409 }
        );
      }
    }

    // Build update payload
    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone === "" ? null : phone;
    if (timeFormat !== undefined) updateData.timeFormat = timeFormat;

    // Update in database
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: updateData,
      select: {
        name: true,
        email: true,
        phone: true,
        role: true,
        timeFormat: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "Not Added",
        role: updatedUser.role,
        timeFormat: updatedUser.timeFormat,
      },
    });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Current password is required." },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await comparePassword(password, dbUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    // Run cascade delete inside transaction
    await prisma.$transaction([
      prisma.notification.deleteMany({ where: { adminId: authUser.id } }),
      prisma.auditLog.deleteMany({ where: { adminId: authUser.id } }),
      prisma.user.delete({ where: { id: authUser.id } }),
    ]);

    const response = NextResponse.json({
      success: true,
      message: "Account permanently deleted successfully.",
    });

    // Clear token cookie
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("DELETE /api/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
