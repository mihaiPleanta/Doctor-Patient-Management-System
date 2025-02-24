import React, { useState, useEffect } from "react";
import axios from "axios";

const Appointment = () => {
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [formData, setFormData] = useState({
    pacient_nume: "",
    pacient_prenume: "",
    data_nasterii: "",
    sex: "",
    adresa: "",
    telefon: "",
    email: "",
    specializare: "",
    medic_id: "",
    data_programarii: "",
    ora_programarii: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors
        const doctorsRes = await axios.get("http://localhost:5000/doctors");
        setDoctors(doctorsRes.data);

        // Extract unique specialities
        const uniqueSpecialities = Array.from(
          new Set(doctorsRes.data.map((doctor) => doctor.specializare))
        );
        setSpecialities(uniqueSpecialities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "specializare") {
      // Filter doctors based on the selected specialty
      const filtered = doctors.filter((doctor) => doctor.specializare === value);
      setFilteredDoctors(filtered);
      setFormData((prevState) => ({ ...prevState, medic_id: "" })); // Reset doctor selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Step 1: Add the patient to the database
      const patientResponse = await axios.post("http://localhost:5000/patients", {
        nume: formData.pacient_nume,
        prenume: formData.pacient_prenume,
        data_nasterii: formData.data_nasterii,
        sex: formData.sex,
        adresa: formData.adresa,
        telefon: formData.telefon,
        email: formData.email,
      });

      const pacient_id = patientResponse.data.pacient_id;

      // Step 2: Add the appointment to the database
      await axios.post("http://localhost:5000/appointments", {
        pacient_id,
        medic_id: formData.medic_id,
        data_programarii: formData.data_programarii,
        ora_programarii: formData.ora_programarii,
        status: "Programat",
      });

      setSuccess("Appointment successfully created!");
      setFormData({
        pacient_nume: "",
        pacient_prenume: "",
        data_nasterii: "",
        sex: "",
        adresa: "",
        telefon: "",
        email: "",
        specializare: "",
        medic_id: "",
        data_programarii: "",
        ora_programarii: "",
      });
      setFilteredDoctors([]);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Failed to create appointment. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Patient Fields */}
        <h3 className="font-semibold text-lg mt-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="pacient_nume"
            placeholder="First Name"
            value={formData.pacient_nume}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="pacient_prenume"
            placeholder="Last Name"
            value={formData.pacient_prenume}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="date"
            name="data_nasterii"
            value={formData.data_nasterii}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <input
            type="text"
            name="adresa"
            placeholder="Address"
            value={formData.adresa}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="tel"
            name="telefon"
            placeholder="Phone"
            value={formData.telefon}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        </div>

        {/* Appointment Fields */}
        <h3 className="font-semibold text-lg mt-4">Appointment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="specializare"
            value={formData.specializare}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Speciality</option>
            {specialities.map((speciality, index) => (
              <option key={index} value={speciality}>
                {speciality}
              </option>
            ))}
          </select>
          <select
            name="medic_id"
            value={formData.medic_id}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Doctor</option>
            {filteredDoctors.map((doctor) => (
              <option key={doctor.medic_id} value={doctor.medic_id}>
                {`${doctor.nume} ${doctor.prenume}`}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="data_programarii"
            value={formData.data_programarii}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="time"
            name="ora_programarii"
            value={formData.ora_programarii}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded mt-4 hover:bg-blue-700 transition"
        >
          Create Appointment
        </button>
      </form>
    </div>
  );
};

export default Appointment;
