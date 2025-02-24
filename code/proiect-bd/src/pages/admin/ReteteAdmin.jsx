import React, { useEffect, useState } from "react";
import axios from "axios";

const ReteteAdmin = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal pentru "Add Prescription"
  const [editRowId, setEditRowId] = useState(null);
  const [editablePrescription, setEditablePrescription] = useState({});
  const [newPrescription, setNewPrescription] = useState({
    pacient_id: "",
    medic_id: "",
    data_emiterii: "",
    detalii_reteta: "",
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = () => {
    axios
      .get("http://localhost:5000/prescriptions")
      .then((response) => {
        setPrescriptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
      });
  };

  const handleAddPrescription = () => {
    axios
      .post("http://localhost:5000/prescriptions", newPrescription)
      .then(() => {
        fetchPrescriptions(); // Actualizează lista de rețete
        setShowModal(false); // Închide modalul
        setNewPrescription({
          pacient_id: "",
          medic_id: "",
          data_emiterii: "",
          detalii_reteta: "",
        });
      })
      .catch((error) => {
        console.error("Error adding prescription:", error);
        alert("Failed to add prescription. Check the logs for more details.");
      });
  };

  const handleEditClick = (prescription) => {
    setEditRowId(prescription.reteta_id);
    setEditablePrescription({ ...prescription });
  };

  const handleSaveClick = (id) => {
    axios
      .put(`http://localhost:5000/prescriptions/${id}`, editablePrescription)
      .then(() => {
        fetchPrescriptions();
        setEditRowId(null);
      })
      .catch((error) => {
        console.error("Error updating prescription:", error);
      });
  };

  const handleDeleteClick = (id) => {
    axios
      .delete(`http://localhost:5000/prescriptions/${id}`)
      .then(() => {
        fetchPrescriptions();
      })
      .catch((error) => {
        console.error("Error deleting prescription:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Prescriptions</h1>
        <table className="w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border border-gray-300">Nr.</th>
              <th className="py-3 px-6 border border-gray-300">Patient ID</th>
              <th className="py-3 px-6 border border-gray-300">Doctor ID</th>
              <th className="py-3 px-6 border border-gray-300">Date</th>
              <th className="py-3 px-6 border border-gray-300 w-1/3">Details</th>
              <th className="py-3 px-6 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription, index) => (
              <tr key={prescription.reteta_id} className="hover:bg-gray-100">
                {editRowId === prescription.reteta_id ? (
                  <>
                    <td className="py-3 px-6 border border-gray-300">{index + 1}</td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="pacient_id"
                        value={editablePrescription.pacient_id}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="medic_id"
                        value={editablePrescription.medic_id}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="date"
                        name="data_emiterii"
                        value={editablePrescription.data_emiterii}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <textarea
                        name="detalii_reteta"
                        value={editablePrescription.detalii_reteta}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full h-20"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <button
                        onClick={() => handleSaveClick(prescription.reteta_id)}
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
                    <td className="py-3 px-6 border border-gray-300">{prescription.pacient_id}</td>
                    <td className="py-3 px-6 border border-gray-300">{prescription.medic_id}</td>
                    <td className="py-3 px-6 border border-gray-300">{prescription.data_emiterii}</td>
                    <td className="py-3 px-6 border border-gray-300 text-left">{prescription.detalii_reteta}</td>
                    <td className="py-3 px-6 border border-gray-300">
                      <button
                        onClick={() => handleEditClick(prescription)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(prescription.reteta_id)}
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
        Add Prescription
      </button>

      {/* Modal for Adding New Prescription */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Prescription</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  name="pacient_id"
                  value={newPrescription.pacient_id}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Doctor ID</label>
                <input
                  type="text"
                  name="medic_id"
                  value={newPrescription.medic_id}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="data_emiterii"
                  value={newPrescription.data_emiterii}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Details</label>
                <textarea
                  name="detalii_reteta"
                  value={newPrescription.detalii_reteta}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded h-24"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddPrescription}
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

export default ReteteAdmin;
