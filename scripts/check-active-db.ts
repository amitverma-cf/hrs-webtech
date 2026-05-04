import { MongoClient } from "mongodb";

async function check() {
  const uri = "mongodb://127.0.0.1:54894/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("hrs");
    const users = await db.collection("users").find({}).toArray();
    console.log("Users in DB (on 54894):", users.map(u => u.username));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

check();
