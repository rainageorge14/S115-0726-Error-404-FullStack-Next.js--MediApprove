import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { MedicineStatus } from "@prisma/client";

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

    const statusParam = searchParams.get("status")?.toUpperCase();
    const whereClause: { status?: MedicineStatus } = {};
    if (statusParam && ["PENDING", "APPROVED", "REJECTED"].includes(statusParam)) {
      whereClause.status = statusParam as MedicineStatus;
    }

    // Return a larger page size or limit as specified by parameter
    const limit = Number(searchParams.get("limit")) || 100;

    const medicines = await prisma.medicineListing.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "asc",
      },
    });

    const total = await prisma.medicineListing.count({
      where: whereClause,
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