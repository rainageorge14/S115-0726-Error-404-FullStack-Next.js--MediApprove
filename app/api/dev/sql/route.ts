import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate check (Require general logged-in user or admin)
    const user = await getAuthenticatedAdmin(req);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please sign in to run dev queries.",
        },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 2. Parse body
    const body = await req.json().catch(() => ({}));
    const { joinType } = body;

    // Validate join type to prevent SQL injection or bad inputs
    const validJoins = ["INNER", "LEFT", "RIGHT", "FULL"];
    if (!joinType || !validJoins.includes(joinType.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid JOIN type. Must be one of: ${validJoins.join(", ")}`,
        },
        { status: 400 } // 400 Bad Request
      );
    }

    const upperJoin = joinType.toUpperCase();

    // 3. Define raw SQL query
    // The "User" model is mapped to the "Admin" table in the database due to @@map("Admin") in schema.prisma.
    // The "AuditLog" and "MedicineListing" are mapped exactly to their database names.
    // We execute a read-only SELECT query performing double joins on foreign keys:
    // AuditLog.adminId -> Admin.id
    // AuditLog.listingId -> MedicineListing.id
    const sqlQuery = `
      SELECT 
        al.id as "logId",
        al.action,
        al."createdAt" as "logDate",
        u.name as "adminName",
        u.email as "adminEmail",
        m."medicineName",
        m.sku,
        m.price
      FROM "AuditLog" al
      ${upperJoin} JOIN "Admin" u ON al."adminId" = u.id
      ${upperJoin} JOIN "MedicineListing" m ON al."listingId" = m.id
      ORDER BY al."createdAt" DESC
      LIMIT 10
    `;

    // 4. Run the raw SQL query safely on the PostgreSQL database
    const queryResults = await prisma.$queryRawUnsafe(sqlQuery);

    return NextResponse.json({
      success: true,
      query: sqlQuery.trim(),
      joinType: upperJoin,
      data: queryResults,
      statusCode: 200,
    });

  } catch (error: unknown) {
    console.error("SQL JOIN endpoint error:", error);
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to execute database join query.",
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
