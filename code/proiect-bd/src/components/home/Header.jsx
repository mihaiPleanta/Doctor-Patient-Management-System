import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 p-6 text-white">
      <nav className="flex justify-between items-center">
        <div className="text-2xl font-bold">Clinica</div>
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/home/dashboard"
              className={({ isActive }) =>
                isActive ? "text-gray-300 underline" : "hover:text-gray-300"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/doctors"
              className={({ isActive }) =>
                isActive ? "text-gray-300 underline" : "hover:text-gray-300"
              }
            >
              All Doctors
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/about"
              className={({ isActive }) =>
                isActive ? "text-gray-300 underline" : "hover:text-gray-300"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/contact"
              className={({ isActive }) =>
                isActive ? "text-gray-300 underline" : "hover:text-gray-300"
              }
            >
              Appointment
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
