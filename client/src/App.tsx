import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/login-page";
import { DoctorDashboard } from "./pages/doctor-dashboard";
import { NurseDashboard } from "./pages/nurse-dashboard";
import { PharmacistDashboard } from "./pages/pharmacist-dashboard";
import { AdminDashboard } from "./pages/admin-dashboard";
import { PatientChartView } from "./pages/patient-chart-view";
import { DischargeSummary } from "./pages/discharge-summary";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/nurse" element={<NurseDashboard />} />
        <Route path="/pharmacist" element={<PharmacistDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/patients/:id" element={<PatientChartView />} />
        <Route path="/print/discharge/:id" element={<DischargeSummary />} />
        {/* Basic catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
