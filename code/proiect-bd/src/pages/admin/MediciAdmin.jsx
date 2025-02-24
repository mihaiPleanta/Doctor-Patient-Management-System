import React, { useEffect, useState } from "react";
import axios from "axios";

const MediciAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false); // For the "Add Doctor" modal
  const [editRowId, setEditRowId] = useState(null);
  const [editableDoctor, setEditableDoctor] = useState({});
  const [newDoctor, setNewDoctor] = useState({
    nume: "",
    prenume: "",
    specializare: "",
    telefon: "",
    email: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios
      .get("http://localhost:5000/doctors")
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  };

  const handleAddDoctor = () => {
    axios
      .post("http://localhost:5000/doctors", newDoctor)
      .then(() => {
        fetchDoctors(); // Refresh the doctor list
        setShowModal(false); // Close the modal
        setNewDoctor({
          nume: "",
          prenume: "",
          specializare: "",
          telefon: "",
          email: "",
        });
      })
      .catch((error) => {
        console.error("Error adding doctor:", error);
        alert("Failed to add doctor. Check the logs for more details.");
      });
  };

  const handleEditClick = (doctor) => {
    setEditRowId(doctor.medic_id);
    setEditableDoctor({ ...doctor });
  };

  const handleSaveClick = (id) => {
    axios
      .put(`http://localhost:5000/doctors/${id}`, editableDoctor)
      .then(() => {
        fetchDoctors();
        setEditRowId(null);
      })
      .catch((error) => {
        console.error("Error updating doctor:", error);
      });
  };

  const handleDeleteClick = (id) => {
    axios
      .delete(`http://localhost:5000/doctors/${id}`)
      .then(() => {
        fetchDoctors();
      })
      .catch((error) => {
        console.error("Error deleting doctor:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctors</h1>
        <table className="w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border border-gray-300">Nr.</th>
              <th className="py-3 px-6 border border-gray-300">First Name</th>
              <th className="py-3 px-6 border border-gray-300">Last Name</th>
              <th className="py-3 px-6 border border-gray-300">Specialization</th>
              <th className="py-3 px-6 border border-gray-300">Phone</th>
              <th className="py-3 px-6 border border-gray-300">Email</th>
              <th className="py-3 px-6 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor.medic_id} className="hover:bg-gray-100">
                {editRowId === doctor.medic_id ? (
                  <>
                    <td className="py-3 px-6 border border-gray-300">{index + 1}</td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="nume"
                        value={editableDoctor.nume}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="prenume"
                        value={editableDoctor.prenume}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="specializare"
                        value={editableDoctor.specializare}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="telefon"
                        value={editableDoctor.telefon}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="email"
                        name="email"
                        value={editableDoctor.email}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <button
                        onClick={() => handleSaveClick(doctor.medic_id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditRowId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-6 border border-gray-300">{index + 1}</td>
                    <td className="py-3 px-6 border border-gray-300">{doctor.nume}</td>
                    <td className="py-3 px-6 border border-gray-300">{doctor.prenume}</td>
                    <td className="py-3 px-6 border border-gray-300">{doctor.specializare}</td>
                    <td className="py-3 px-6 border border-gray-300">{doctor.telefon}</td>
                    <td className="py-3 px-6 border border-gray-300">{doctor.email}</td>
                    <td className="py-3 px-6 border border-gray-300">
                      <button
                        onClick={() => handleEditClick(doctor)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(doctor.medic_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded mt-6"
      >
        Add Doctor
      </button>

      {/* Modal for Adding New Doctor */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Doctor</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="nume"
                  value={newDoctor.nume}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="prenume"
                  value={newDoctor.prenume}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  name="specializare"
                  value={newDoctor.specializare}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="telefon"
                  value={newDoctor.telefon}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newDoctor.email}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddDoctor}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediciAdmin;
