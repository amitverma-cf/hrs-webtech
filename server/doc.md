# Backend Documentation: Healthcare EMR Server

## 🏗 Project Structure
The server follows a strict **MVC (Model-View-Controller)** architecture built on the **Bun** runtime for high performance.

```text
server/
├── .mongo-data/           # Persistent local MongoDB storage
├── src/
│   ├── db.ts              # Database connection & Memory Server factory
│   ├── app.ts             # Express application & middleware setup
│   ├── index.ts           # Server entry point
│   ├── controllers/       # Business logic for clinical workflows
│   ├── middleware/        # JWT & RBAC security layers
│   ├── routes/            # API endpoint definitions
│   ├── services/          # Infrastructure services (Security, Audit)
│   ├── schemas/           # Zod validation schemas
│   └── tests/             # API integration tests
```

---

## 🗄 Model (Database Layer)
The system uses the **Native MongoDB Driver**. 
- **Persistence:** Locally, it uses `mongodb-memory-server` with the `wiredTiger` storage engine. This allows data to persist in the `.mongo-data` folder without requiring a local MongoDB installation.
- **Switching:** By changing `DATABASE_URL` in `.env`, the system seamlessly connects to a cloud instance (Atlas) or a local persistent one.

### Collections:
1. **users:** Staff accounts with hashed passwords and roles.
2. **patients:** Demographics with encrypted PII.
3. **clinical_records:** Doctor notes and diagnoses (Encrypted).
4. **prescriptions:** Medication orders with status tracking.
5. **vital_logs:** High-frequency bedside data (BP, Temp, SpO2).
6. **audit_logs:** Immutable, append-only trail of every system mutation.

---

## 🎮 Controllers (Business Logic)
Controllers manage the request lifecycle and interact with services.

- **AuthController:** Handles staff registration and login. It verifies roles and account status, issuing signed JWTs upon success.
- **PatientController:** Manages patient records. It coordinates with the `SecurityService` to encrypt data before saving and decrypt it during retrieval.
- **VitalController:** Specialized for nurses to log physiological data.
- **PrescriptionController:** Manages the lifecycle of medication from issuance (Doctor) to dispensing (Pharmacist).
- **AdminController:** Provides oversight, including user status toggling and audit trail extraction.

---

## 🛡 Services (Infrastructure)

### SecurityService (`node:crypto`)
Implements **AES-256-GCM** encryption.
- **Encryption Logic:** Every piece of sensitive data (PII, Diagnosis) is stored as `iv:tag:ciphertext`. This ensures that even with database access, clinical data remains unreadable.
- **Key Management:** Uses a 32-character key derived via `scryptSync`.

### AuditService
Ensures clinical compliance.
- **Logic:** Provides a `log` method that is invoked by every write operation. It captures the action, resource, timestamp, and the identity of the performer.
- **Immutability:** The system provides no API routes or controller logic to update or delete these records.

---

## 🛣 API Routes & RBAC
All clinical routes are protected by `AuthMiddleware`.

| Path | Method | Allowed Roles | Logic |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | All | Issues JWT and logs login. |
| `/api/patients` | POST | Doctor, Admin | Encrypts and stores new patient. |
| `/api/patients/:id` | GET | Clinical Staff | Retrieves and decrypts patient chart. |
| `/api/clinical/vitals` | POST | Nurse, Admin | Records physiological data. |
| `/api/clinical/prescriptions`| POST | Doctor, Admin | Issues a new pending prescription. |
| `/api/admin/audit-logs` | GET | Admin | Retrieves system history logs. |
| `/api/admin/users/:id/status`| PATCH | Admin | Instantly activates/deactivates staff. |

---

## 🧪 Validation & Integrity
- **Zod:** Every request body is strictly validated against a Zod schema before logic execution. This prevents injection and ensures data type consistency across the MongoDB documents.
- **Error Handling:** Centralized JSON error responses (`{ error: "message" }`) with appropriate HTTP status codes (401, 403, 400).
