import { NextResponse } from "next/server";
import { PrismaClient, MedicineStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
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