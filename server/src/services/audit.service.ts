import prisma from "../db";

export class AuditService {
  static async log(
    action: string,
    resourceType: string,
    resourceId: string,
    performedBy: string,
    metadata: any = {}
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          resourceType,
          resourceId,
          performedBy,
          timestamp: new Date(),
          metadata: JSON.stringify(metadata),
        },
      });
    } catch (error) {
      console.error("Critical: Failed to write audit log", error);
    }
  }
}
