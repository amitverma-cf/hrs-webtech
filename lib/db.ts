import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "node:path";

// Extend global type for Next.js HMR stability
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongod: MongoMemoryServer | undefined;
}

/**
 * Standard MongoDB Client Promise.
 * Supports:
 * 1. Standard mongodb:// or mongodb+srv:// URIs.
 * 2. "memory" keyword to spin up a local persistent mongodb-memory-server (useful for dev/test).
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  let uri = process.env.DATABASE_URL;
  const isTest = process.env.NODE_ENV === "test";
  const useMemory = !uri || uri === "memory" || isTest;

  if (useMemory) {
    if (!global._mongod) {
      console.log(`🚀 Starting local persistent MongoDB via Memory Server (${isTest ? "TEST" : "DEV"})...`);
      global._mongod = await MongoMemoryServer.create({
        instance: {
          dbPath: path.join(process.cwd(), ".mongo-data"),
          storageEngine: "wiredTiger",
        },
      });
    }
    uri = global._mongod.getUri();
  }

  if (!uri) {
    throw new Error(
      "Please define the DATABASE_URL environment variable inside .env.local (or .env)"
    );
  }

  // Ensure URI starts with valid scheme if not using memory server (though memory server returns valid URI)
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
     throw new Error(`Invalid DATABASE_URL scheme: ${uri}. Expected mongodb:// or mongodb+srv://`);
  }

  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
  return global._mongoClientPromise;
}

/**
 * Returns the MongoDB Database instance.
 */
export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.DB_NAME || "hrs");
}

/**
 * Closes the database connection and stops the memory server if running.
 */
export async function closeDatabase() {
  if (global._mongoClientPromise) {
    const client = await global._mongoClientPromise;
    await client.close();
    global._mongoClientPromise = undefined;
  }
  if (global._mongod) {
    await global._mongod.stop();
    global._mongod = undefined;
  }
}
