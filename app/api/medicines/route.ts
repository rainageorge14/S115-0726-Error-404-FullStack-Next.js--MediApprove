import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    // Problem statement: one pending medicine per page
    const limit = 100;

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
    console.error("Pending medicines error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch medicines",
      },
      { status: 500 }
    );
  }
}