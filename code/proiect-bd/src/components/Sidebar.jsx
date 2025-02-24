import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Patients", path: "/admin/pacienti" }, // "Pacienti" changed to "Patients"
    { name: "Doctors", path: "/admin/medici" }, // "Medici" changed to "Doctors"
    { name: "Appointments", path: "/admin/programari" }, // "Programari" changed to "Appointments"
    { name: "Prescriptions", path: "/admin/retete" }, // "Retete" changed to "Prescriptions"
  ];

  return (
    <div className="h-screen bg-white shadow-md">
      <div className="p-6 font-bold text-blue-600 text-lg">Admin Panel</div>
      <ul className="space-y-2 mt-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg ${
                  isActive ? "bg-blue-100 text-blue-600 font-bold" : "text-gray-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
