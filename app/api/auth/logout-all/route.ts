import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Invalidate all tokens by incrementing tokenVersion
    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out from all devices successfully",
      },
      {
        status: 200,
      }
    );

    // Clear token cookie
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout All Error:", error);

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
