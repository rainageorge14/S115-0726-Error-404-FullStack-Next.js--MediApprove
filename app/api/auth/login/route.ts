import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { comparePassword } from "@/lib/hash";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        {
          status: 400,
        }
      );
    }

    const { email, password } = parsed.data;

    const admin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordValid = await comparePassword(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    // Set JWT cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}