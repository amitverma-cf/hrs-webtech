import { connectDB } from "../db";
import { v4 as uuidv4 } from "uuid";

export class AuditService {
  static async log(
    action: string,
    resourceType: string,
    resourceId: string,
    performedBy: string,
    metadata: any = {}
  ) {
    try {
      const db = await connectDB();
      await db.collection("audit_logs").insertOne({
        id: uuidv4(),
        action,
        resourceType,
        resourceId,
        performedBy,
        timestamp: new Date(),
        metadata,
      });
    } catch (error) {
      console.error("Critical: Failed to write audit log", error);
    }
  }
}
