import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditAction, MedicineStatus } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const admin = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    const medicine = await prisma.medicineListing.findUnique({
      where: { id },
    });

    if (!medicine) {
      return NextResponse.json(
        { success: false, message: "Medicine not found" },
        { status: 404 }
      );
    }

    const updatedMedicine = await prisma.medicineListing.update({
      where: { id },
      data: {
        status: MedicineStatus.REJECTED,
      },
    });

    await createAuditLog(
      admin.id,
      medicine.id,
      AuditAction.REJECTED
    );

    return NextResponse.json({
      success: true,
      message: "Medicine rejected successfully",
      data: updatedMedicine,
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