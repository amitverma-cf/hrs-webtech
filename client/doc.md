# Frontend Documentation: Healthcare EMR Client

## 🏗 Project Structure
The client is a **Vite + React** single-page application built with a strict separation between clinical logic and user interface.

```text
client/
├── src/
│   ├── components/        # Pure UI Components (No hooks/state)
│   │   ├── ui/            # shadcn/ui primitives
│   │   ├── forms/         # Clinical entry forms
│   │   └── layout/        # App and Print wrappers
│   ├── pages/             # Orchestrators (Hooks, State, Routing)
│   ├── hooks/             # Encapsulated clinical logic
│   ├── services/          # API Communication (Axios)
│   ├── types/             # Clinical data definitions
│   └── App.tsx            # Navigation & Global Providers
```

---

## 🏛 Separation of Concerns Mandate
- **Pages as Orchestrators:** Pages in `src/pages` are responsible for fetching data (via hooks), managing local UI state (modals, tabs), and handling event submissions. They **do not** contain raw Tailwind CSS for complex layouts.
- **Pure Components:** Components in `src/components` are stateless. They receive all clinical data and callback functions (like `onSubmit`) via props. This makes them highly testable and prevents "prop drilling" of complex logic.

---

## 🪝 Encapsulated Hooks (Logic)
Hooks are the source of truth for all clinical data management.

- **useAuth:** Manages the staff session. It handles login/logout and provides the `user` object containing the clinical role.
- **usePatients:** Logic for the global patient directory. Handles creation and directory fetching.
- **useVitals:** Managed state for high-frequency physiological data.
- **usePrescriptions:** Real-time management of the dispensing queue for pharmacists.
- **usePatientChart:** Aggregator hook. It fetches data from multiple services (Vitals + Records) and formats them into a chronological event array for the timeline.

---

## 🖼 Page Orchestrators

- **LoginPage:** The entry point. Validates credentials and redirects staff to their specific dashboard based on role claims in the JWT.
- **DoctorDashboard:** Clinical hub for physicians. Manages patient search and clinical entry.
- **NurseDashboard:** Optimized for bedside use. Orchestrates the patient list and the vitals entry dialog.
- **PharmacistDashboard:** Operational queue. Orchestrates the dispensing lifecycle and inventory status.
- **AdminDashboard:** Oversight panel. Orchestrates user management (Staff directory) and the security audit trail.
- **PatientChartView:** The comprehensive medical record view. It orchestrates the demographics card and the `ClinicalTimeline`.

---

## 🖨 Clinical Reporting System
Replaces legacy JSP with modern web standards.

- **PrintLayout:** A specialized container that uses CSS `@media print` to hide navigation, standardise fonts, and ensure A4-compliance for clinical records.
- **DischargeSummary:** A dedicated page designed for physical handouts. It extracts the most recent vitals and clinical notes to generate a professional medical summary.
- **Navigation:** Uses `window.open` with specific routes to ensure print views open in clean tabs without dashboard clutter.

---

## 🎨 Design System
- **shadcn/ui:** All UI primitives (Buttons, Cards, Tables, Tabs) are standard shadcn components added via the registry.
- **Tailwind CSS:** Used for utility-first responsive styling across all clinical views.
- **Sonner:** Integrated notification system for real-time feedback on clinical actions (e.g., "Vitals Saved").
