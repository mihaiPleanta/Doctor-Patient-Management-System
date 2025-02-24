import React, { useEffect, useState } from "react";
import axios from "axios";

const Doctors = () => {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors and specializations
        const doctorsRes = await axios.get("http://localhost:5000/doctors");
        setDoctors(doctorsRes.data);
        setFilteredDoctors(doctorsRes.data);

        // Extract unique specializations
        const uniqueSpecializations = Array.from(
          new Set(doctorsRes.data.map((doctor) => doctor.specializare))
        );
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSpecializationClick = (specialization) => {
    setSelectedSpecialization(specialization);
    if (specialization) {
      const filtered = doctors.filter(
        (doctor) => doctor.specializare === specialization
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Browse Specializations</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleSpecializationClick("")}
                className={`block w-full text-left px-4 py-2 rounded ${
                  selectedSpecialization === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                All Specializations
              </button>
            </li>
            {specializations.map((specialization, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSpecializationClick(specialization)}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    selectedSpecialization === specialization
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {specialization}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Doctors List */}
        <div className="w-3/4 ml-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Our Doctors</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.medic_id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{`${doctor.nume} ${doctor.prenume}`}</h2>
                    <p className="text-gray-600">{doctor.specializare}</p>
                  </div>
                  <div>
                    <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Available
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Contact: {doctor.email}</p>
                <p className="text-sm text-gray-600">Phone: {doctor.telefon}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
