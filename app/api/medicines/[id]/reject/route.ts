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
          message: "Only pending medicines can be rejected",
        },
        { status: 409 }
      );
    }

    let body: { reason?: string; notes?: string } = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedMedicine = await tx.medicineListing.update({
        where: { id },
        data: {
          status: MedicineStatus.REJECTED,
        },
      });

      const auditLog = await tx.auditLog.create({
        data: {
          adminId: admin.id,
          listingId: medicine.id,
          action: AuditAction.REJECTED,
        },
      });

      return {
        updatedMedicine,
        auditLog,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Medicine rejected successfully",
      data: result.updatedMedicine,
      auditLog: result.auditLog,
      rejection: {
        reason: body.reason || null,
        notes: body.notes || null,
      },
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Reject medicine error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}