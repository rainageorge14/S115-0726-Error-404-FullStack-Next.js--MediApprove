import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = 1; // One medicine per page as per PRD

    const medicines = await prisma.medicineListing.findMany({
      where: {
        status: "PENDING",
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "asc",
      },
    });

    const total = await prisma.medicineListing.count({
      where: {
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: medicines,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch medicines",
      },
      {
        status: 500,
      }
    );
  }
}