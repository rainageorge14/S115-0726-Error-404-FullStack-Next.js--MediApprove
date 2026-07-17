import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditAction, MedicineStatus } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Temporary admin until JWT authentication is implemented
    const admin = await prisma.admin.findFirst();

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
        status: MedicineStatus.APPROVED,
      },
    });

    await createAuditLog(
      admin.id,
      medicine.id,
      AuditAction.APPROVED
    );

    return NextResponse.json({
      success: true,
      message: "Medicine approved successfully",
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