import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MedicineStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
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

    const totalMedicines = await prisma.medicineListing.count();

    const pendingMedicines = await prisma.medicineListing.count({
      where: {
        status: MedicineStatus.PENDING,
      },
    });

    const approvedMedicines = await prisma.medicineListing.count({
      where: {
        status: MedicineStatus.APPROVED,
      },
    });

    const rejectedMedicines = await prisma.medicineListing.count({
      where: {
        status: MedicineStatus.REJECTED,
      },
    });

    const recentActivity = await prisma.auditLog.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listing: {
          select: {
            id: true,
            medicineName: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalMedicines,
        pendingMedicines,
        approvedMedicines,
        rejectedMedicines,
        recentActivity,
      },
    });
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