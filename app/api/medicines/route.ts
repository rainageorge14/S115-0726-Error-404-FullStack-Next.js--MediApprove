import { NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  Prisma,
  MedicineStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const where: Prisma.MedicineListingWhereInput = {};

    if (search) {
      where.OR = [
        {
          medicineName: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          sku: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          vendor: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }

    if (
      status &&
      Object.values(MedicineStatus).includes(status as MedicineStatus)
    ) {
      where.status = status as MedicineStatus;
    }

    const medicines = await prisma.medicineListing.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.medicineListing.count({
      where,
    });

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: medicines,
    });
  } catch (error) {
    console.error("GET /api/medicines Error:", error);

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