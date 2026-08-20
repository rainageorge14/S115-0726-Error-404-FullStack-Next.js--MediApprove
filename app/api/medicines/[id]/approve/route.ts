import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditAction, MedicineStatus } from "@prisma/client";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const medicine = await prisma.medicineListing.findUnique({
      where: { id },
    });

    if (!medicine) {
      return NextResponse.json(
        {
          success: false,
          message: "Medicine not found",
        },
        { status: 404 }
      );
    }

    if (medicine.status !== MedicineStatus.PENDING) {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending medicines can be approved",
        },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedMedicine = await tx.medicineListing.update({
        where: { id },
        data: {
          status: MedicineStatus.APPROVED,
          approvedBy: admin.name,
          approvedAt: new Date(),
        },
      });

      const auditLog = await tx.auditLog.create({
        data: {
          adminId: admin.id,
          listingId: medicine.id,
          action: AuditAction.APPROVED,
        },
      });

      const notification = await tx.notification.create({
        data: {
          title: "Medicine Approved",
          message: `Medicine listing ${medicine.medicineName} has been approved by ${admin.name}.`,
          adminId: admin.id,
        },
      });

      return {
        updatedMedicine,
        auditLog,
        notification,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Medicine approved successfully",
      data: result.updatedMedicine,
      auditLog: result.auditLog,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Approve medicine error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}