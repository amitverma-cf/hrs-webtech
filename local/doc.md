# HRS: Hospital Record System — Technical & Business Documentation

## 🏗 System Architecture
The HRS is a **Template-Driven, Task-Oriented Inpatient Management System** designed to minimize clinical error and optimize hospital throughput.

- **Frontend**: Next.js 16 (App Router) with Tailwind CSS 4.
- **UI Components**: Shadcn UI (Radix Primitives).
- **Database**: MongoDB (via `mongodb` driver).
- **Security**: Edge-compatible JWT verification (`jose`) handled in `proxy.ts`.
- **Runtime**: Bun (optimized for speed and developer experience).

---

## 🔐 Role-Based Access Control (RBAC)
The system enforces strict boundary isolation via Edge-level headers (`x-user-id`, `x-user-role`).

| Role | Core Responsibility | Primary Views |
| :--- | :--- | :--- |
| **Admin** | Infrastructure & Compliance | User Approval, Bed Config, Disease Templates, Audit Logs |
| **Doctor** | Clinical Strategy | Patient Registration, Admissions, Ad-Hoc Orders, Alert Review |
| **Nurse** | Clinical Execution | Ward Task Queue, Vital Logging, Safety Gate Verification |
| **Pharmacist** | Supply & Fulfillment | Medication Queue, Manifest Printing |
| **Patient** | Information Consumer | Care Progress Tracking, Itemized Billing, Discharge Records |

---

## 📋 Core Business Logic & Workflows

### 1. The "Deterministic Protocol" Engine
The heart of the HRS is the **Disease Template**. Instead of doctors writing manual daily orders, they assign a pre-defined template (e.g., "Severe Pneumonia") during admission.
- **Auto-Generation**: Upon admission, the system instantly queues 48 hours of time-bound tasks (Metrics and Medications).
- **Refill Logic**: Doctors can "Refill" the protocol to extend the task queue for another 48 hours as needed.

### 2. Ward & Facility Management
The hospital is logically divided into **Wards** (ICU, General Med, etc.). 
- **Auto-Allocation**: When a patient is admitted, the system automatically finds the first available bed in the facility and links it to the admission.
- **Logical Isolation**: Staff can filter their dashboards by Ward to focus on their specific area of responsibility.

### 3. Clinical Safety Gate (Execution Layer)
To prevent "Blind Execution" errors, the Nurse dashboard employs a safety modal. 
- **Requirement**: Before marking a task (like administering a drug) as complete, the nurse is presented with the patient's **Allergies** and **Most Recent Vitals**.
- **Observation**: If the task is a "Metric," the nurse must input the observed value (e.g., Temperature) which is then saved to the clinical record.

### 4. Vital Threshold & Alerting System
Templates define safe ranges for vitals (e.g., SpO2 > 92%).
- **Automated Monitoring**: When a nurse logs a vital that falls outside the template's threshold, the system immediately spawns an **Urgent Alert Task**.
- **Doctor Notification**: This alert appears at the top of the Doctor's task queue for immediate clinical intervention.

### 5. Ad-Hoc Clinical Ordering
While protocol-driven, the system allows for clinical flexibility.
- **Injections**: Doctors can inject "Ad-Hoc" tasks (one-time meds or labs) into a patient's active admission without changing the underlying template.

### 6. Dynamic Billing & Discharge
Billing is a live ledger, not a post-process.
- **Line Items**: Every executed medication task and daily room charge is automatically appended to the patient's `billing` record.
- **Discharge**: Discharging a patient frees the bed, cancels all remaining pending tasks, and generates a printable **Official Discharge Summary & Final Bill**.

---

## 🛠 Database Schema Model

- **Users**: Staff/Patient credentials and approval status.
- **Patients**: Decrypted demographic data and clinical history (encrypted at rest).
- **Wards**: Logical groupings of beds.
- **Beds**: Physical locations with occupancy tracking.
- **Templates**: Standard protocols with metric/medication frequencies and thresholds.
- **Admissions**: The active link between a patient, doctor, bed, and template.
- **Tasks**: Discrete execution units (Pending/Completed/Urgent).
- **Vitals**: Historical logs of patient observations.
- **Billing**: Financial ledger for the admission episode.
