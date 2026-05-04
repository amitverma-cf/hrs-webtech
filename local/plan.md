# Healthcare EMR Implementation Plan (Next.js App Router)

## 🏥 Project Overview
A secure, high-performance EMR system using Next.js App Router. This version refines the previous Express/Vite plan into a unified full-stack architecture with RBAC and specialized dashboards.

---

## 🛠 Technical Foundation
- **Runtime:** Bun
- **Framework:** Next.js 15 (App Router)
- **Database:** Native MongoDB Driver
- **Validation:** Zod
- **Security:** JWT + Hashed Passwords (bcryptjs)
- **UI:** Tailwind CSS + shadcn/ui

---

## 📅 Phased Implementation Plan

### Phase 1: Project Restructuring & DB Cleanup (COMPLETED)
- [x] **1.1 Folder Cleanup:** Moved loose scripts to `scripts/`.
- [x] **1.2 Package Update:** Updated `package.json` with new script paths.
- [x] **1.3 DB Refactor:** Simplified `lib/db.ts` to use standard `DATABASE_URL` for dev/prod and memory server for testing.

### Phase 2: Auth & RBAC Setup (NEXT)
- [ ] **2.1 Auth UI:** Create unified Login and Signup pages in `app/(auth)`.
- [ ] **2.2 Auth API:** Implement `/api/auth/login` and `/api/auth/signup` with role assignment.
- [ ] **2.3 RBAC Middleware:** Implement middleware to protect role-based routes.

### Phase 3: Dashboard Layouts
- [ ] **3.1 Shared Layout:** Create `components/layout/dashboard-layout.tsx` (icon sidebar, no header).
- [ ] **3.2 Role Dashboards:** Implement `layout.tsx` for `app/admin`, `app/doctor`, `app/nurse`, `app/pharmacist`, and `app/patients`.

### Phase 4: Feature Workflows
- [ ] **4.1 Admin:** User Management & Audit Logs.
- [ ] **4.2 Doctor:** Patient Records & Prescriptions.
- [ ] **4.3 Nurse:** Vitals Entry & Timelines.
- [ ] **4.4 Pharmacist:** Prescription Queue.
- [ ] **4.5 Patient:** Personal Health Records.

---

## 🔐 Role-Based Access Control (RBAC) Strategy
| Role | Access Level | Primary Responsibilities |
| :--- | :--- | :--- |
| **Admin** | System | User management, Audit logs. |
| **Doctor** | High (Clinical) | CRUD patient records, Prescriptions. |
| **Nurse** | Medium (Clinical) | Logging vitals, Medication administration. |
| **Pharmacist** | Specific | Prescription queue, Dispensing. |
| **Patient** | Restricted | Viewing personal health records. |

---

## 🔒 Security Mandates
1. **No plaintext PII:** Sensitive clinical data must be encrypted if possible, or strictly protected by RBAC.
2. **Audit everything:** Clinical actions (prescriptions, vitals) must generate immutable audit logs.
3. **Pure UI:** Logic stays in Hooks or Server Components. UI components receive props.
