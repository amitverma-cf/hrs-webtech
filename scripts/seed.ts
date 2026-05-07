import { getDatabase, closeDatabase } from "../lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    const db = await getDatabase();
    console.log("🧹 Resetting database...");
    
    // Explicitly drop the database for a clean state
    await db.dropDatabase();
    console.log("✨ Database dropped. Starting fresh seed...");

    const passwordHash = await bcrypt.hash("password123", 12);

    // 1. Seed Wards
    console.log("🏢 Seeding wards...");
    const wards = [
      { id: uuidv4(), name: "General Medicine", description: "Standard care ward" },
      { id: uuidv4(), name: "ICU", description: "Intensive Care Unit" },
      { id: uuidv4(), name: "Pediatrics", description: "Children's ward" },
    ];
    await db.collection("wards").insertMany(wards);

    // 2. Seed Users
    console.log("👥 Seeding users...");
    const users = [
      {
        id: uuidv4(),
        username: "admin",
        passwordHash,
        role: "admin",
        accountStatus: "active",
        fullName: "System Administrator",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "dr_smith",
        passwordHash,
        role: "doctor",
        accountStatus: "active",
        fullName: "Dr. Alice Smith",
        department: "Internal Medicine",
        specialty: "Pulmonology",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "nurse_joy",
        passwordHash,
        role: "nurse",
        accountStatus: "active",
        fullName: "Nurse Joy",
        department: "General Medicine",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "pharmacist_sam",
        passwordHash,
        role: "pharmacist",
        accountStatus: "active",
        fullName: "Sam Pharmacist",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        username: "patient_john",
        passwordHash,
        role: "patient",
        accountStatus: "active",
        fullName: "John Doe",
        createdAt: new Date(),
      },
    ];
    await db.collection("users").insertMany(users);

    // 3. Seed Patients
    console.log("🩺 Seeding patients...");
    const patientUser = users.find(u => u.username === "patient_john")!;
    const patientJohn = {
      id: patientUser.id,
      fullName: "John Doe",
      dateOfBirth: "1985-05-15",
      gender: "male",
      contactInfo: "+1 555 0199",
      allergies: ["Penicillin", "Peanuts"],
      createdAt: new Date(),
    };
    await db.collection("patients").insertMany([patientJohn]);

    // 4. Seed Beds
    console.log("🛏️ Seeding beds...");
    const beds = [];
    const genMedWard = wards[0];
    const icuWard = wards[1];

    for (let i = 1; i <= 10; i++) {
      beds.push({
        id: uuidv4(),
        wardId: genMedWard.id,
        roomNumber: `10${i}`,
        isOccupied: false,
        dailyRate: 150,
      });
    }
    for (let i = 1; i <= 5; i++) {
      beds.push({
        id: uuidv4(),
        wardId: icuWard.id,
        roomNumber: `20${i}`,
        isOccupied: false,
        dailyRate: 500,
      });
    }
    await db.collection("beds").insertMany(beds);

    // 5. Seed Disease Templates
    console.log("📋 Seeding disease templates...");
    const templates = [
      {
        id: uuidv4(),
        name: "Severe Pneumonia Protocol",
        description: "Standard care for severe pneumonia requiring inpatient monitoring.",
        metrics: [
          { name: "SpO2 Level", frequencyHours: 4 },
          { name: "Body Temperature", frequencyHours: 8 },
        ],
        medications: [
          { name: "Ceftriaxone", dose: "1g IV", frequencyHours: 12, cost: 45 },
          { name: "Azithromycin", dose: "500mg PO", frequencyHours: 24, cost: 12 },
        ],
        vitalThresholds: [
          { metric: "spO2", min: 92, urgent: true },
          { metric: "temperature", max: 38.5, urgent: true },
        ],
      },
    ];
    await db.collection("templates").insertMany(templates);

    // 6. Seed an active Admission
    console.log("🏥 Seeding an active admission...");
    const drSmith = users.find(u => u.username === "dr_smith")!;
    const bed101 = beds[0];
    const pneumoniaTemplate = templates[0];

    const admissionId = uuidv4();
    await db.collection("admissions").insertOne({
      id: admissionId,
      patientId: patientJohn.id,
      doctorId: drSmith.id,
      bedId: bed101.id,
      templateId: pneumoniaTemplate.id,
      status: "active",
      startDate: new Date(),
    });

    await db.collection("beds").updateOne(
      { id: bed101.id },
      { $set: { isOccupied: true, currentPatientId: patientJohn.id } }
    );

    // 7. Generate Tasks
    console.log("✅ Generating tasks for admission...");
    const tasks = [];
    const now = new Date();

    for (const metric of pneumoniaTemplate.metrics) {
      for (let h = 0; h < 24; h += metric.frequencyHours) {
        const targetTime = new Date(now.getTime() + h * 60 * 60 * 1000);
        tasks.push({
          id: uuidv4(),
          admissionId,
          type: "metric",
          description: metric.name,
          targetTime,
          status: h === 0 ? "completed" : "pending",
          priority: "normal",
          executedBy: h === 0 ? users.find(u => u.role === "nurse")?.id : undefined,
          result: h === 0 ? "98%" : undefined,
          createdAt: now,
        });
      }
    }

    for (const med of pneumoniaTemplate.medications) {
      for (let h = 0; h < 24; h += med.frequencyHours) {
        const targetTime = new Date(now.getTime() + h * 60 * 60 * 1000);
        tasks.push({
          id: uuidv4(),
          admissionId,
          type: "medication",
          description: `${med.name} (${med.dose})`,
          targetTime,
          status: "pending",
          priority: "normal",
          cost: med.cost,
          createdAt: now,
        });
      }
    }
    await db.collection("tasks").insertMany(tasks);

    // 8. Billing
    console.log("💳 Seeding billing...");
    await db.collection("billing").insertOne({
      admissionId,
      lineItems: [
        { description: "Admission Registration Fee", amount: 100, date: now }
      ],
      total: 100
    });

    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await closeDatabase();
    process.exit(0);
  }
}

seed().catch(console.error);
