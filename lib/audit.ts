import prisma from "@/lib/prisma";
import { AuditAction } from "@prisma/client";

export async function createAuditLog(
  adminId: string,
  listingId: string,
  action: AuditAction
) {
  return prisma.auditLog.create({
    data: {
      adminId,
      listingId,
      action,
    },
  });
}