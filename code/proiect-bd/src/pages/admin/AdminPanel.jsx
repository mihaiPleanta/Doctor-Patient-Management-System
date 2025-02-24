import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import DashboardAdmin from "./DashboardAdmin"; // Placeholder component for Dashboard
import PacientiAdmin from "./PacientiAdmin"; // Placeholder component for Pacienti
import MediciAdmin from "./MediciAdmin"; // Placeholder component for Medici
import ProgramariAdmin from "./ProgramariAdmin"; // Placeholder component for Programari
import ReteteAdmin from "./ReteteAdmin"; // Placeholder component for Retete

const AdminPanel = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for navigation */}
      <Sidebar />
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/dashboard" element={<DashboardAdmin />} />
          <Route path="/pacienti" element={<PacientiAdmin />} />
          <Route path="/medici" element={<MediciAdmin />} />
          <Route path="/programari" element={<ProgramariAdmin />} />
          <Route path="/retete" element={<ReteteAdmin />} />
          <Route path="/" element={<DashboardAdmin />} /> {/* Default route */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
