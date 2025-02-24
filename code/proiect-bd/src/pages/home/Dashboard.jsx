import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;
  const navigate = useNavigate(); // Hook for navigation

  const testimonials = [
    {
      name: "Maria Ionescu",
      feedback: "Amazing experience! The doctors were very professional.",
    },
    {
      name: "Andrei Popescu",
      feedback: "Booking appointments has never been easier.",
    },
    {
      name: "Elena Stan",
      feedback: "Highly recommend this clinic for everyone!",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors
        const doctorsRes = await axios.get("http://localhost:5000/doctors");
        const doctorsData = doctorsRes.data;

        setDoctors(doctorsData);

        // Extract unique specialities
        const uniqueSpecialities = Array.from(
          new Set(doctorsData.map((doctor) => doctor.specializare))
        );
        setSpecialities(uniqueSpecialities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white p-10 flex flex-col md:flex-row items-center justify-between rounded-lg shadow-lg">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">Your Health, Our Priority</h1>
          <p className="mb-6">
            Trusted by thousands, we provide professional healthcare services. Book appointments, find specialists, and access your health records.
          </p>
          <button
            onClick={() => navigate("/home/contact")} // Navigate to Appointment page
            className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Get Started →
          </button>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <img src="/assets/hero_image.png" alt="Health" className="w-full max-w-sm rounded-lg shadow-md" />
        </div>
      </section>

      {/* Specialities Section */}
      <section className="text-center py-10">
        <h2 className="text-3xl font-bold mb-6">Our Specialities</h2>
        <p className="text-gray-600 mb-8">Explore our range of specialized healthcare services.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {specialities.length > 0 ? (
            specialities.map((speciality, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full mb-4">
                  <span className="text-xl font-bold">{speciality.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{speciality}</h3>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No specialities available.</p>
          )}
        </div>
      </section>

      {/* Doctors List Section */}
      <section className="py-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Available Doctors</h2>
        <p className="text-center text-gray-600 mb-8">Meet our team of highly skilled healthcare professionals.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.length > 0 ? (
            currentDoctors.map((doctor) => (
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
            ))
          ) : (
            <p className="text-gray-600 text-center">No doctors available.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="py-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Patients Say</h2>
        <div className="flex justify-center gap-6 px-4 overflow-x-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-center text-gray-800">{testimonial.feedback}</p>
              <p className="text-center text-sm text-gray-600 mt-2">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
