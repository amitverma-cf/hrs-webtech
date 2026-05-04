# Healthcare Record System — Project Execution Plan

**Project:** Electronic Medical Records (EMR) System with Role-Based Access Control  
**Difficulty:** Advanced  
**Team Size:** 5 People  
**Duration:** 3 Days (Hard Deadline)  
**Stack:** MongoDB · Express.js · React.js · Node.js · JSP

---

## 1. Project Overview

This plan coordinates the construction of a fully functional EMR system across five people in three days. The system must support four distinct clinical roles — Doctor, Nurse, Pharmacist, and Admin — each with its own scoped API access, dashboard, and permitted actions. Sensitive fields must be encrypted at rest using Node.js's `crypto` module. Every action taken by any user must be written to an immutable audit log. Prescriptions and discharge summaries must be printable via JSP-rendered pages.

The work is divided so that infrastructure and security foundations (P1) are established on Day 1, enabling backend feature development (P2, P3) and frontend work (P4) to proceed in parallel on Day 2, with integration, JSP pages, and testing completing the sprint on Day 3. P5 owns integration, testing, and the audit/security layer throughout.

No deliverable has been omitted from the abstract. The plan covers: role-based access, doctor workflows (records, prescriptions, lab requests), nurse workflows (vitals, medication administration), pharmacist prescription processing, admin management, HIPAA-style field-level encryption, the immutable audit log, all role-specific dashboards with patient timelines, the prescription workflow UI, and JSP print pages.

---

## 2. Role Assignment Summary

| ID | Role | Primary Ownership | Hard Deadline |
|----|------|------------------|---------------|
| **P1** | Infrastructure & Security Lead | MongoDB schemas, JWT auth with role claims, field-level encryption middleware, project scaffolding | Day 1 · 18:00 |
| **P2** | Backend — Doctor & Nurse APIs | Doctor endpoints (records, prescriptions, lab requests) and Nurse endpoints (vitals, medication administration) | Day 2 · 18:00 |
| **P3** | Backend — Pharmacist, Admin & Audit APIs | Pharmacist prescription processing, admin management endpoints, immutable audit log middleware | Day 2 · 18:00 |
| **P4** | Frontend — React Dashboards & Workflows | All four role-specific dashboards, patient timeline component, prescription workflow UI | Day 3 · 12:00 |
| **P5** | Integration, JSP Pages & QA Lead | JSP discharge summary and prescription printout pages, end-to-end integration, test coverage, final wiring | Day 3 · 18:00 |

---

## 3. Master Timeline

| Day | Time | Milestone | Owner |
|-----|------|-----------|-------|
| Day 1 | 08:00 | Kickoff sync: confirm environment, repo structure, `.env` conventions, port assignments | All |
| Day 1 | 10:00 | MongoDB connection verified; base schemas drafted | P1 |
| Day 1 | 13:00 | JWT middleware with role claims working; role guard tested on a dummy route | P1 |
| Day 1 | 15:00 | Field-level encryption middleware implemented and unit-tested | P1 |
| Day 1 | 18:00 | P1 delivers: working auth layer + encryption middleware + all Mongoose schemas to P2, P3, P4 | P1 → All |
| Day 2 | 08:00 | Brief sync — surface blockers (15 min max) | All |
| Day 2 | 10:00 | Doctor and Nurse API routes at 50% completion | P2 |
| Day 2 | 10:00 | Audit log middleware wired to Express; pharmacist route scaffolding done | P3 |
| Day 2 | 12:00 | P4 has auth context + role routing working in React shell | P4 |
| Day 2 | 18:00 | All backend routes complete, tested individually, and pushed to repo | P2, P3 |
| Day 3 | 08:00 | Brief sync — integration status check (15 min max) | All |
| Day 3 | 10:00 | React dashboards for all four roles complete and connected to APIs | P4 |
| Day 3 | 12:00 | JSP print pages (discharge summary + prescription) functional | P5 |
| Day 3 | 15:00 | End-to-end integration complete; full workflow smoke test passing | P5 |
| Day 3 | 18:00 | Final submission: repo pushed, README complete, demo walkthrough recorded | All |

---

## 4. Person 1 — Infrastructure & Security Lead

**Deadline: Day 1 · 18:00**

P1 builds the foundations that every other person depends on. No backend feature can be developed securely without the auth layer and encryption middleware, and no frontend can implement role routing without a working JWT structure. P1's Day 1 delivery is the single most critical gate in the project.

### Checklist

| # | Task | Collaborates With | Due |
|---|------|------------------|-----|
| 1 | Initialise the monorepo: `/server` (Node/Express), `/client` (React), `/jsp` directories; set up `.env.example` with all required keys | All | Day 1 · 09:00 |
| 2 | Connect Express to MongoDB Atlas (or local instance); confirm connection in startup log | P2, P3 | Day 1 · 10:00 |
| 3 | Define all Mongoose schemas: `Patient`, `MedicalRecord`, `Prescription`, `LabRequest`, `VitalLog`, `MedicationAdministration`, `AuditLog`, `User` | P2, P3 | Day 1 · 11:00 |
| 4 | Implement JWT generation on login with role claim (`role: "doctor" \| "nurse" \| "pharmacist" \| "admin"`) and appropriate expiry | P2, P3, P4 | Day 1 · 12:00 |
| 5 | Implement `authenticate` middleware: validates Bearer token, attaches `req.user` with `id` and `role` | P2, P3 | Day 1 · 12:30 |
| 6 | Implement `authorise(...roles)` middleware: returns 403 if `req.user.role` is not in the allowed list | P2, P3 | Day 1 · 13:00 |
| 7 | Write a test route `GET /api/ping-role` that returns the caller's role; verify all four roles work correctly | P2 | Day 1 · 13:30 |
| 8 | Implement field-level encryption middleware using Node.js `crypto` (AES-256-GCM); encrypt: diagnosis, prescription details, lab results, and any PII fields defined in schema | P2, P3, P5 | Day 1 · 15:00 |
| 9 | Implement decryption helper that runs transparently on document read for authorised roles only | P2, P3 | Day 1 · 15:30 |
| 10 | Seed the database with one User per role for integration testing; document credentials in `SEEDING.md` | P2, P3, P4, P5 | Day 1 · 16:30 |
| 11 | Push all schemas, middleware, and seed script to repo; notify team | All | Day 1 · 18:00 |

### Collaboration Obligations

P1 must not delay beyond 18:00 on Day 1. P2 and P3 cannot implement any data-writing routes without the schemas and auth middleware. P4 cannot implement role-conditional rendering without the JWT structure. If the encryption middleware is taking longer than expected, P1 must flag this at 15:00 — not after — so P2 and P3 can stub it temporarily and proceed.

---

## 5. Person 2 — Backend: Doctor & Nurse APIs

**Deadline: Day 2 · 18:00**

P2 builds all API routes associated with the Doctor and Nurse roles. Every route must use P1's `authenticate` and `authorise` middleware, and every write operation must trigger the audit log middleware built by P3.

### Checklist

| # | Task | Collaborates With | Due |
|---|------|------------------|-----|
| 1 | Pull P1's schemas and middleware; verify auth works on a sample protected route | P1 | Day 1 · 18:30 |
| 2 | `POST /api/patients` — Doctor creates a new patient record (encrypted fields applied via P1's middleware) | P1 | Day 2 · 09:00 |
| 3 | `GET /api/patients/:id` — Doctor retrieves full patient record (decrypted for doctor role) | P1 | Day 2 · 09:00 |
| 4 | `PUT /api/patients/:id` — Doctor updates patient record; write audit log entry on every update | P3 | Day 2 · 09:30 |
| 5 | `POST /api/prescriptions` — Doctor creates a prescription linked to a patient; status defaults to `pending` | P3 | Day 2 · 10:00 |
| 6 | `GET /api/prescriptions?patientId=` — Doctor views all prescriptions for a patient | P3 | Day 2 · 10:00 |
| 7 | `POST /api/lab-requests` — Doctor creates a lab test request linked to a patient | P3 | Day 2 · 10:30 |
| 8 | `GET /api/lab-requests/:id` — Doctor retrieves lab result once available (encrypted result field decrypted for doctor only) | P1, P3 | Day 2 · 10:30 |
| 9 | `POST /api/vitals` — Nurse logs vitals (temperature, BP, heart rate, SpO2, etc.) for a patient | — | Day 2 · 11:30 |
| 10 | `GET /api/vitals?patientId=` — Nurse (and Doctor) retrieves vitals history for a patient | P4 | Day 2 · 11:30 |
| 11 | `POST /api/medication-administrations` — Nurse records that a medication was administered (links to a prescription); write audit log entry | P3 | Day 2 · 12:30 |
| 12 | `GET /api/medication-administrations?patientId=` — Nurse retrieves administration history for a patient | P4 | Day 2 · 12:30 |
| 13 | Ensure all routes return 403 when called by a disallowed role (verify with curl/Postman against seeded users) | P5 | Day 2 · 16:00 |
| 14 | Push all routes to repo with inline JSDoc comments; notify P3 and P4 | P3, P4 | Day 2 · 18:00 |

### Collaboration Obligations

P2 must coordinate with P3 on the audit log middleware integration before writing any route that modifies data (steps 4, 5, 7, 11). P3 must expose the audit middleware as an importable Express middleware function by Day 2 · 10:00 so P2 can attach it without restructuring routes. P2 must also share the complete list of route paths and expected response shapes with P4 by Day 2 noon so that the frontend team can begin wiring.

---

## 6. Person 3 — Backend: Pharmacist, Admin & Audit APIs

**Deadline: Day 2 · 18:00**

P3 builds the pharmacist and admin routes and, critically, the immutable audit log middleware that every write operation in the system must invoke. Because the audit layer is shared infrastructure, P3 must expose it early enough for P2 to use it.

### Checklist

| # | Task | Collaborates With | Due |
|---|------|------------------|-----|
| 1 | Pull P1's schemas and middleware; verify auth and encryption are working | P1 | Day 1 · 18:30 |
| 2 | Implement audit log middleware: `logAudit(action, resourceType, resourceId, performedBy, metadata)` — writes an `AuditLog` document; the collection must be append-only (no update or delete routes may exist for it) | P2, P5 | Day 2 · 10:00 |
| 3 | Expose `logAudit` as a reusable async function importable by P2's routes | P2 | Day 2 · 10:00 |
| 4 | `GET /api/prescriptions/pending` — Pharmacist retrieves all prescriptions with status `pending` | — | Day 2 · 10:30 |
| 5 | `PUT /api/prescriptions/:id/process` — Pharmacist marks a prescription as `dispensed` or `rejected`; logs audit entry | — | Day 2 · 11:00 |
| 6 | `GET /api/prescriptions/:id` — Pharmacist views full prescription details (encrypted fields decrypted for pharmacist role only for fields they are authorised to see) | P1 | Day 2 · 11:30 |
| 7 | `POST /api/lab-results` — Admin or authorised lab technician posts a lab result linked to a `LabRequest`; encrypted at write time; logs audit entry | P1 | Day 2 · 12:00 |
| 8 | `GET /api/users` — Admin retrieves list of all system users (no sensitive patient data exposed) | — | Day 2 · 12:30 |
| 9 | `POST /api/users` — Admin creates a new user with an assigned role; password hashed with bcrypt | — | Day 2 · 13:00 |
| 10 | `PUT /api/users/:id/role` — Admin changes a user's role; logs audit entry | — | Day 2 · 13:30 |
| 11 | `DELETE /api/users/:id` — Admin deactivates (soft-deletes) a user; logs audit entry; does not physically remove the record | — | Day 2 · 14:00 |
| 12 | `GET /api/audit-log` — Admin retrieves audit log entries with filters (by user, by resource, by date range); read-only, no write route | P5 | Day 2 · 15:00 |
| 13 | Verify that no route exists anywhere in the codebase that updates or deletes an `AuditLog` document; document this invariant in `AUDIT.md` | P5 | Day 2 · 16:00 |
| 14 | Push all routes and audit middleware to repo; notify P2, P4, P5 | P2, P4, P5 | Day 2 · 18:00 |

### Collaboration Obligations

P3's most urgent obligation is exposing the `logAudit` function to P2 by Day 2 · 10:00. P2 cannot safely implement any write route before this. The two can coordinate informally from Day 1 evening. P3 must also share the full audit log schema and the `GET /api/audit-log` response shape with P5 by Day 2 · 15:00 so that P5 can build the admin audit view and the JSP print page if needed.

---

## 7. Person 4 — Frontend: React Dashboards & Workflows

**Deadline: Day 3 · 12:00**

P4 builds the entire React frontend: role-specific dashboards, the patient timeline component, and the prescription workflow UI. P4 can begin scaffolding on Day 1 evening using P1's JWT structure and work in earnest from Day 2 morning as backend routes come online.

### Checklist

| # | Task | Collaborates With | Due |
|---|------|------------------|-----|
| 1 | Set up React app with React Router; implement `AuthContext` storing JWT, decoded role, and user ID | P1 | Day 1 · 19:00 |
| 2 | Implement `ProtectedRoute` component: redirects to login if unauthenticated; redirects to role dashboard if role mismatches | P1 | Day 1 · 19:30 |
| 3 | Build login page: calls `POST /api/auth/login`, stores JWT in `AuthContext`, routes user to their role's dashboard | P1 | Day 2 · 09:00 |
| 4 | **Doctor Dashboard:** patient search, patient record view (with decrypted fields), create/update patient record form | P2 | Day 2 · 11:00 |
| 5 | **Doctor Dashboard:** create prescription form linked to a patient; view prescription history | P2, P3 | Day 2 · 11:30 |
| 6 | **Doctor Dashboard:** create lab request form; view lab results when available | P2 | Day 2 · 12:00 |
| 7 | **Patient Timeline Component:** chronological display of vitals, prescriptions, lab results, and medication administrations for a selected patient — reused across Doctor and Nurse dashboards | P2 | Day 2 · 13:00 |
| 8 | **Nurse Dashboard:** vitals logging form (all required fields); vitals history table | P2 | Day 2 · 14:00 |
| 9 | **Nurse Dashboard:** medication administration form (links to a prescription); administration history | P2 | Day 2 · 14:30 |
| 10 | **Pharmacist Dashboard:** pending prescriptions queue; process prescription action (dispense / reject) with confirmation dialog | P3 | Day 2 · 16:00 |
| 11 | **Admin Dashboard:** user management table (create user, change role, deactivate); audit log viewer with filters | P3 | Day 2 · 17:00 |
| 12 | Add "Print Discharge Summary" button (Doctor dashboard) and "Print Prescription" button (Doctor/Pharmacist dashboard) — these open the JSP-rendered URLs in a new tab | P5 | Day 3 · 09:00 |
| 13 | Handle API errors gracefully on all forms: display role-appropriate error messages (403 vs 500 vs validation) | — | Day 3 · 10:00 |
| 14 | Smoke-test all four role flows end-to-end against the live backend; report integration issues to P5 | P5 | Day 3 · 12:00 |

### Collaboration Obligations

P4 must obtain the full list of API route paths and expected response shapes from P2 and P3 by Day 2 noon. P4 should not hard-code assumptions about response structure — if a response shape is unclear, ask P2/P3 immediately rather than guessing. The JSP print button integration (step 12) requires P5 to share the JSP URL patterns by Day 3 · 08:00.

---

## 8. Person 5 — Integration, JSP Pages & QA Lead

**Deadline: Day 3 · 18:00**

P5 owns two distinct responsibilities: the JSP-rendered clinical print pages, and the end-to-end integration and QA of the entire system. P5 works across all layers and is responsible for ensuring the final submission is a coherent, working product.

### Checklist — JSP Print Pages

| # | Task | Collaborates With | Due |
|---|------|------------------|-----|
| 1 | Set up a minimal Java servlet container (Tomcat or embedded Jetty) to serve JSP pages; confirm it can receive query parameters from the React app | P4 | Day 2 · 10:00 |
| 2 | **Discharge Summary JSP:** `discharge.jsp` — renders patient name, diagnosis (decrypted and passed via secure server-side call), admission/discharge dates, attending doctor, medications on discharge, and follow-up instructions in a printable clinical layout | P2, P3 | Day 3 · 10:00 |
| 3 | **Prescription Printout JSP:** `prescription.jsp` — renders patient name, prescribing doctor, date, medication name, dosage, frequency, duration, and a signature line in a printable clinical layout | P2, P3 | Day 3 · 10:00 |
| 4 | Ensure JSP pages are served over a route that requires a short-lived signed token (passed as a query parameter) so that printout URLs cannot be accessed without authentication | P1 | Day 3 · 11:00 |
| 5 | Share JSP URL patterns with P4 for the print buttons in the React dashboard | P4 | Day 3 · 08:00 |

### Checklist — Integration & QA

| # | Task | Collaborates With | Due |
|---|------|------------------|-----|
| 6 | From Day 1 evening: maintain a running integration checklist tracking which API routes are complete and which frontend components depend on them | P2, P3, P4 | Ongoing |
| 7 | On Day 2 evening: run a partial integration test — wire at least the Doctor login-to-patient-record flow end-to-end and confirm encryption is functioning correctly | P1, P2, P4 | Day 2 · 19:00 |
| 8 | Verify that the audit log receives an entry for every write operation across all roles; attempt a direct `DELETE` on the `AuditLog` collection and confirm it is refused | P3 | Day 3 · 10:00 |
| 9 | Test role isolation: confirm that a Nurse token cannot access Doctor-only routes; a Pharmacist token cannot access Admin routes; etc. (minimum: one negative test per role boundary) | P1, P2, P3 | Day 3 · 11:00 |
| 10 | Run the full end-to-end workflow smoke test: Doctor creates patient → prescribes medication → Nurse logs vitals → Nurse administers medication → Pharmacist processes prescription → Doctor requests lab → Admin views audit log → Print discharge summary | All | Day 3 · 15:00 |
| 11 | Fix any integration failures found in step 10; coordinate patches with relevant owners | P2, P3, P4 | Day 3 · 16:30 |
| 12 | Write `README.md`: setup instructions, environment variables, seeded credentials, how to run each service, how to access JSP pages | — | Day 3 · 17:00 |
| 13 | Final push: confirm repo contains server, client, JSP module, seed script, README, and `.env.example` | All | Day 3 · 18:00 |

### Collaboration Obligations

P5's most important Day 2 task is the partial integration test at 19:00. Catching wiring problems on Day 2 evening rather than Day 3 morning gives the team recovery time. P5 must also communicate the JSP URL patterns to P4 before Day 3 · 08:00 so that P4 can complete the print button integration without waiting. For the full smoke test (step 10), P5 should use the seeded credentials provided by P1 and should not depend on any manual data setup.

---

## 9. Collaboration & Handoff Map

| Handoff | What Must Be Delivered | When |
|---------|----------------------|------|
| P1 → P2 & P3 | Mongoose schemas, `authenticate` middleware, `authorise` middleware, encryption/decryption middleware, seed script | Day 1 · 18:00 |
| P1 → P4 | JWT structure documentation (payload shape, role values), seeded user credentials | Day 1 · 18:00 |
| P3 → P2 | `logAudit` function available as an importable module | Day 2 · 10:00 |
| P2 → P4 | Full list of Doctor and Nurse route paths + expected response shapes | Day 2 · 12:00 |
| P3 → P4 | Full list of Pharmacist and Admin route paths + expected response shapes | Day 2 · 12:00 |
| P2 & P3 → P5 | All routes pushed to repo; confirmation that individual route tests pass | Day 2 · 18:00 |
| P5 → P4 | JSP URL patterns for print buttons | Day 3 · 08:00 |
| P4 → P5 | All dashboards connected to live APIs; integration issues flagged | Day 3 · 12:00 |
| P5 → All | Full smoke test results; list of any remaining issues | Day 3 · 15:00 |

A late handoff must be communicated before its due time. If a handoff slips by more than two hours, the affected downstream person must immediately flag it in the team channel so the group can decide whether to reassign, stub, or descope.

---

## 10. Technical Conventions (Binding on All Team Members)

**Repository structure.** Use a single monorepo with three top-level directories: `/server`, `/client`, `/jsp`. All environment variables go in `.env` (gitignored) with a committed `.env.example`. No credentials are committed to the repo under any circumstances.

**Authentication.** All protected routes must use P1's `authenticate` middleware followed by `authorise(...roles)`. Never implement ad-hoc role checks inside route handler logic — always use the shared middleware.

**Audit logging.** Every route that creates, updates, or deletes a resource must call `logAudit` before sending a response. There are no exceptions. There must be no Express route, Mongoose hook, or script anywhere in the codebase that updates or deletes an `AuditLog` document.

**Encryption.** Fields designated as sensitive in P1's schema documentation must always be written via the encryption middleware and never stored in plaintext. Decryption must only occur for roles that are authorised to see the field. If you are unsure whether a field requires encryption, treat it as sensitive and confirm with P1.

**Error responses.** Use consistent HTTP status codes: 400 for validation errors, 401 for missing or invalid tokens, 403 for authorisation failures, 404 for missing resources, 500 for unexpected server errors. Include a `{ error: "message" }` JSON body on all error responses.

**Frontend role routing.** The React app must never rely on hiding a UI element as a security control. All access control is enforced on the server. The frontend role routing exists for UX only.

**Commits.** Commit and push at the end of every working session. Write descriptive commit messages. Do not push directly to `main` — use short-lived feature branches and merge when a task is complete.

**Final submission deadline: Day 3 · 18:00. This is absolute.**

---

*End of Plan*
