import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import Dashboard from "./Dashboard"; // Exemplu de pagină
import Doctors from "./Doctors"; // Exemplu de pagină
import About from "./About"; // Exemplu de pagină
import Appointment from "./Appointment"; // Exemplu de pagină

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow p-6 bg-gray-100">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/" element={<Dashboard />} /> {/* Ruta implicită */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Appointment />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
