import { getDatabase } from "./db";
import { v4 as uuidv4 } from "uuid";
import { DiseaseTemplate, Task } from "./schemas";

export class TaskService {
  /**
   * Generates tasks for a new admission based on the assigned disease template.
   * Generates tasks for the first 48 hours.
   */
  static async generateTasksForAdmission(admissionId: string, templateId: string) {
    const db = await getDatabase();
    
    const template = await db.collection<DiseaseTemplate>("templates").findOne({ id: templateId });
    if (!template) throw new Error("Template not found");

    const tasks: Task[] = [];
    const now = new Date();
    const durationHours = 48; // Generate tasks for the next 2 days

    // 1. Generate Metric Tasks
    for (const metric of template.metrics) {
      for (let h = 0; h < durationHours; h += metric.frequencyHours) {
        // Start from next hour to avoid immediate pileup, or start now
        const targetTime = new Date(now.getTime() + h * 60 * 60 * 1000);
        tasks.push({
          id: uuidv4(),
          admissionId,
          type: "metric",
          description: metric.name,
          targetTime,
          status: "pending",
          priority: "normal",
          isAdHoc: false,
          createdAt: now,
        });
      }
    }

    // 2. Generate Medication Tasks
    for (const med of template.medications) {
      for (let h = 0; h < durationHours; h += med.frequencyHours) {
        const targetTime = new Date(now.getTime() + h * 60 * 60 * 1000);
        tasks.push({
          id: uuidv4(),
          admissionId,
          type: "medication",
          description: `${med.name} (${med.dose})`,
          targetTime,
          status: "pending",
          priority: "normal",
          cost: med.cost, // Store cost at time of task generation for billing
          isAdHoc: false,
          createdAt: now,
        });
      }
    }

    if (tasks.length > 0) {
      await db.collection("tasks").insertMany(tasks);
    }

    return tasks.length;
  }
}
