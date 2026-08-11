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

    const logs = await prisma.auditLog.findMany({
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        listing: {
          select: {
            id: true,
            medicineName: true,
            sku: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Audit logs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch audit logs",
      },
      { status: 500 }
    );
  }
}
