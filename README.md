# Healthcare EMR System (HRS)

A unified, modern Electronic Medical Record (EMR) system built with Next.js 16, designed for high performance, security, and ease of local development.

## 🚀 Quick Start

### Setup & Run
1. **Install Dependencies:**
   ```bash
   bun install
   ```

2. **Seed the Database:**
   Initialize the system with a persistent admin user.
   ```bash
   bun run seed
   ```
   *Default Admin: `admin` / `admin123`*

3. **Start Development:**
   ```bash
   bun dev
   ```
   The app will be available at `http://localhost:3000`.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Exclusively installed via CLI)
- **Database:** MongoDB (Local persistence via `mongodb-memory-server`)
- **Auth:** JWT (HttpOnly Cookies) + `bcryptjs`
- **Validation:** [Zod](https://zod.dev/)
- **Security:** AES-256-GCM for Patient PII Encryption

## 🔐 Security & Architecture

### Encryption
All patient Personal Identifiable Information (PII) such as full names, dates of birth, and contact info are encrypted using **AES-256-GCM** before being stored in MongoDB. The `SecurityService` (`lib/security.ts`) handles transparent encryption/decryption at the service layer.

### Request Interception
The project uses the **Next.js 16 `proxy.ts` convention** (replacing `middleware.ts`) to enforce authentication and role-based access control across all API routes and pages.

### Database Singleton
The `lib/db.ts` uses a singleton pattern to maintain a stable MongoDB connection across Hot Module Replacement (HMR) and manages the lifecycle of the embedded `mongodb-memory-server`.

## 🏥 Clinical Workflows

The system supports four distinct clinical roles:

- **Admin Dashboard:** System oversight, user management (enable/disable staff), and immutable clinical audit logs.
- **Doctor Dashboard:** Patient registry management, clinical history review, and issuing prescriptions.
- **Nurse Dashboard:** Bedside vitals logging and active patient monitoring.
- **Pharmacist Dashboard:** Real-time dispensing queue for verifying and fulfilling prescriptions.

## 📂 Project Structure

- `app/api/`: Unified API routes for clinical logic.
- `app/(clinical)/`: Role-based dashboard pages.
- `components/ui/`: CLI-managed Shadcn components.
- `hooks/`: Role-specific React hooks for clinical state management.
- `lib/`: Core services (Auth, Audit, DB, Security, Schemas).
- `proxy.ts`: Global request interceptor and security gate.
- `.mongo-data/`: Persistent local database storage.

## 📜 Commands

| Command | Description |
| :--- | :--- |
| `bun dev` | Starts the Next.js dev server with Turbopack. |
| `bun run seed` | Seeds the initial admin user. |
| `bun run build` | Builds the project for production. |
| `bun run lint` | Runs ESLint for code quality checks. |
| `bun run typecheck` | Validates TypeScript integrity. |
