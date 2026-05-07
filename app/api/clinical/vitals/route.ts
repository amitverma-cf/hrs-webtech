import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { VitalLogSchema } from "@/lib/schemas";
import { AuditService } from "@/lib/audit";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");
    const userId = h.get("x-user-id");

    if (role !== "nurse" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = VitalLogSchema.parse(body);
    const db = await getDatabase();
    const id = uuidv4();
    const now = new Date();

    // 1. Log the vital
    await db.collection("vitals").insertOne({
      id,
      ...data,
      nurseId: userId,
      recordedAt: now,
    });

    // 2. Check for Threshold Breaches
    // Find active admission for this patient
    const admission = await db.collection("admissions").aggregate([
        { $match: { patientId: data.patientId, status: "active" } },
        {
            $lookup: {
                from: "templates",
                localField: "templateId",
                foreignField: "id",
                as: "template"
            }
        },
        { $unwind: "$template" }
    ]).next();

    if (admission && admission.template.vitalThresholds) {
        const breaches: string[] = [];
        for (const threshold of admission.template.vitalThresholds) {
            const val = (data as Record<string, unknown>)[threshold.metric] as number | undefined;
            if (val !== undefined) {
                if (threshold.min !== undefined && val < threshold.min) {
                    breaches.push(`${threshold.metric} low: ${val} (min ${threshold.min})`);
                }
                if (threshold.max !== undefined && val > threshold.max) {
                    breaches.push(`${threshold.metric} high: ${val} (max ${threshold.max})`);
                }
            }
        }

        if (breaches.length > 0) {
            // Spawn an Alert Task for the Doctor
            await db.collection("tasks").insertOne({
                id: uuidv4(),
                admissionId: admission.id,
                type: "alert",
                description: `THRESHOLD BREACH: ${breaches.join(", ")}`,
                targetTime: now,
                status: "pending",
                priority: "urgent",
                createdAt: now,
            });
        }
    }

    await AuditService.log("VITALS_LOGGED", "vital_log", id, userId!);

    return NextResponse.json({ id, message: "Vitals logged successfully" }, { status: 201 });
  } catch (error) {
    console.error("Vitals log error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
