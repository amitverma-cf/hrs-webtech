# Healthcare HRS (Hospital Record System)

A high-fidelity, template-driven inpatient management system built with Next.js 16, Shadcn UI, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Setup Environment
Create a `.env.local` file in the root:
```env
JWT_SECRET=your_super_secret_key_here
DATABASE_URL=memory # Uses local persistent mongodb-memory-server
# For real MongoDB: DATABASE_URL=mongodb://localhost:27017
```

### 3. Seed the Database
**Important**: This will reset your database and create initial wards, beds, templates, and users.
```bash
bun run seed
```

### 4. Run Development Server
```bash
bun dev
```
Visit `http://localhost:3000`

---

## 🔑 User Credentials (Default Seed)

All accounts use the same default password: **`password123`**

| Role | Username | Description |
| :--- | :--- | :--- |
| **Admin** | `admin` | Full system control & user approvals. |
| **Doctor** | `dr_smith` | Manages admissions and protocols. |
| **Nurse** | `nurse_joy` | Executes tasks and logs vitals. |
| **Pharmacist** | `pharmacist_sam` | Fulfills medication orders. |
| **Patient** | `patient_john` | Views personal care analytics & bill. |

---

## ✨ Key Features

- **Protocol-Based Care**: Auto-generate 48h task queues based on disease templates.
- **Clinical Safety Gate**: Pre-execution allergy and vital checks for Nurses.
- **Urgent Alerting**: Automatic alert generation when vitals breach template thresholds.
- **Ward Hierarchy**: Organize your facility into ICU, General Medicine, and Pediatrics.
- **Live Billing**: Real-time itemized billing statements updated as tasks are executed.
- **Printable Manifests**: Official discharge summaries and pharmacy delivery manifests.

## 🛠 Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI + Lucide Icons
- **Database**: MongoDB
- **Auth**: JWT via `jose` (Edge Runtime compatible)
- **Logic**: Zod-validated schemas and deterministic task generation service.

---
*Note: This system is designed for a single-facility context, focusing on minimizing staff cognitive load through deterministic clinical protocols.*
