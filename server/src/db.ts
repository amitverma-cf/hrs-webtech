import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let db: Db;
let mongod: MongoMemoryServer | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  let uri = process.env.DATABASE_URL;

  // If no URI is provided, start a local persistent instance
  if (!uri || uri.includes("memory")) {
    console.log("🚀 Starting local persistent MongoDB...");
    mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: path.join(process.cwd(), ".mongo-data"),
        storageEngine: "wiredTiger",
      },
    });
    uri = mongod.getUri();
    console.log(`✅ Local MongoDB running at: ${uri}`);
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.DB_NAME || "emr");
  
  console.log(`✅ Connected to MongoDB: ${db.databaseName}`);
  return db;
}

export { client };
