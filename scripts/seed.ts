import { getDatabase, closeDatabase } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcryptjs";

async function seed() {
  try {
    const db = await getDatabase();
    
    // Clear existing users if any (optional)
    // await db.collection("users").deleteMany({});

    const adminExists = await db.collection("users").findOne({ username: "admin" });

    if (!adminExists) {
      const passwordHash = await bcrypt.hash("admin123", 12);
      const id = uuidv4();

      await db.collection("users").insertOne({
        id,
        username: "admin",
        passwordHash,
        role: "admin",
        accountStatus: "active",
        createdAt: new Date(),
      });

      console.log("Admin user seeded: admin / admin123");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await closeDatabase();
    process.exit(0);
  }
}

seed().catch(console.error);
