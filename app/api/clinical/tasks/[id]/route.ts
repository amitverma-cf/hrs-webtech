import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");
    const userId = h.get("x-user-id");

    if (!["admin", "nurse", "pharmacist", "doctor"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status, result } = await req.json();

    const db = await getDatabase();
    
    const updateData: Record<string, unknown> = { 
      status, 
      executedBy: userId,
      executedAt: new Date()
    };
    
    if (result) {
      updateData.result = result;
    }

    await db.collection("tasks").updateOne(
      { id },
      { $set: updateData }
    );

    // If task is completed and has a cost, add to billing
    if (status === "completed") {
      const task = await db.collection("tasks").findOne({ id });
      if (task && task.cost) {
        await db.collection("billing").updateOne(
          { admissionId: task.admissionId },
          { 
            $push: { 
              lineItems: { 
                description: task.description, 
                amount: task.cost, 
                date: new Date() 
              } 
            },
            $inc: { total: task.cost }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          { upsert: true }
        );
      }
    }

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update task" }, { status: 400 });
  }
}
