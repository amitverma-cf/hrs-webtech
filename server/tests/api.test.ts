import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import app from "../src/app";
import { connectDB, client } from "../src/db";

describe("Healthcare EMR API Tests (Native MongoDB)", () => {
  let doctorToken: string;
  let adminToken: string;
  let patientId: string;

  beforeAll(async () => {
    // Override DB name for testing
    process.env.DB_NAME = "emr_test";
    await connectDB();
  });

  afterAll(async () => {
    const db = await connectDB();
    // Only drop if success is managed by shell script or manually
    // await db.dropDatabase(); 
    await client.close();
  });

  it("should register an admin user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "admin_test",
        password: "password123",
        role: "admin"
      });
    expect(res.status).toBe(201);
  });

  it("should register a doctor user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "doctor_test",
        password: "password123",
        role: "doctor"
      });
    expect(res.status).toBe(201);
  });

  it("should login as admin", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "admin_test",
        password: "password123"
      });
    expect(res.status).toBe(200);
    adminToken = res.body.token;
  });

  it("should login as doctor", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "doctor_test",
        password: "password123"
      });
    expect(res.status).toBe(200);
    doctorToken = res.body.token;
  });

  it("should create a patient (Doctor only)", async () => {
    const res = await request(app)
      .post("/api/patients")
      .set("Authorization", `Bearer ${doctorToken}`)
      .send({
        fullName: "John Doe",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        contactInfo: "555-0199"
      });
    expect(res.status).toBe(201);
    patientId = res.body.id;
  });

  it("should retrieve a patient with decrypted info", async () => {
    const res = await request(app)
      .get(`/api/patients/${patientId}`)
      .set("Authorization", `Bearer ${doctorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe("John Doe");
  });

  it("should view audit logs (Admin only)", async () => {
    const res = await request(app)
      .get("/api/admin/audit-logs")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
