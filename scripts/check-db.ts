import { getDatabase } from "../lib/db";

async function check() {
  const db = await getDatabase();
  const users = await db.collection("users").find({}).toArray();
  console.log("Users in DB:", users.map(u => u.username));
  process.exit(0);
}

check().catch(console.error);
