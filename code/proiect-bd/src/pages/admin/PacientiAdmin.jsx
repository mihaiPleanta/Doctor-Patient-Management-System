import React, { useEffect, useState } from "react";
import axios from "axios";

const PacientiAdmin = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false); // For the pop-up
  const [editRowId, setEditRowId] = useState(null);
  const [editablePatient, setEditablePatient] = useState({});
  const [newPatient, setNewPatient] = useState({
    nume: "",
    prenume: "",
    data_nasterii: "",
    sex: "",
    adresa: "",
    telefon: "",
    email: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios
      .get("http://localhost:5000/patients")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  };

  const handleAddPatient = () => {
    axios
      .post("http://localhost:5000/patients", newPatient)
      .then(() => {
        fetchPatients(); // Refresh the patient list
        setShowModal(false); // Close the modal
        setNewPatient({
          nume: "",
          prenume: "",
          data_nasterii: "",
          sex: "",
          adresa: "",
          telefon: "",
          email: "",
        });
      })
      .catch((error) => {
        console.error("Error adding patient:", error);
        alert("Failed to add patient. Check the logs for more details.");
      });
  };

  const handleEditClick = (patient) => {
    setEditRowId(patient.pacient_id);
    setEditablePatient({ ...patient });
  };

  const handleSaveClick = (id) => {
    axios
      .put(`http://localhost:5000/patients/${id}`, editablePatient)
      .then(() => {
        fetchPatients();
        setEditRowId(null);
      })
      .catch((error) => {
        console.error("Error updating patient:", error);
      });
  };

  const handleDeleteClick = (id) => {
    axios
      .delete(`http://localhost:5000/patients/${id}`)
      .then(() => {
        fetchPatients();
      })
      .catch((error) => {
        console.error("Error deleting patient:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Patients</h1>
        <table className="w-full border border-gray-300 text-center">
        <thead className="bg-gray-100">
  <tr>
    <th className="py-3 px-6 border border-gray-300">Nr.</th>
    <th className="py-3 px-6 border border-gray-300">First Name</th>
    <th className="py-3 px-6 border border-gray-300">Last Name</th>
    <th className="py-3 px-6 border border-gray-300" style={{minWidth: "140px"}}>Date of Birth</th>
    <th className="py-3 px-6 border border-gray-300">Sex</th>
    <th className="py-3 px-6 border border-gray-300">Address</th>
    <th className="py-3 px-6 border border-gray-300">Phone</th>
    <th className="py-3 px-6 border border-gray-300">Email</th>
    <th className="py-3 px-6 border border-gray-300">Registration Date</th>
    <th className="py-3 px-6 border border-gray-300" style={{ minWidth: "200px" }}>
      Actions
    </th>
  </tr>
</thead>

<tbody>
  {patients.map((patient, index) => (
    <tr key={patient.pacient_id} className="hover:bg-gray-100">
      {editRowId === patient.pacient_id ? (
        <>
          {/* Afișează numărul în loc de ID */}
          <td className="py-3 px-6 border border-gray-300">{index + 1}</td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="text"
              name="nume"
              value={editablePatient.nume}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="text"
              name="prenume"
              value={editablePatient.prenume}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="date"
              name="data_nasterii"
              value={formatDate(editablePatient.data_nasterii)}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="text"
              name="sex"
              value={editablePatient.sex}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full text-center"
              style={{ width: "100px" }}
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="text"
              name="adresa"
              value={editablePatient.adresa}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="text"
              name="telefon"
              value={editablePatient.telefon}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <input
              type="email"
              name="email"
              value={editablePatient.email}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </td>
          <td className="py-3 px-6 border border-gray-300">
            {formatDate(editablePatient.data_inregistrarii)}
          </td>
          <td className="py-3 px-6 border border-gray-300">
            <button
              onClick={() => handleSaveClick(patient.pacient_id)}
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
          {/* Afișează numărul în loc de ID */}
          <td className="py-3 px-6 border border-gray-300">{index + 1}</td>
          <td className="py-3 px-6 border border-gray-300">{patient.nume}</td>
          <td className="py-3 px-6 border border-gray-300">{patient.prenume}</td>
          <td className="py-3 px-6 border border-gray-300">{formatDate(patient.data_nasterii)}</td>
          <td className="py-3 px-6 border border-gray-300">{patient.sex}</td>
          <td className="py-3 px-6 border border-gray-300">{patient.adresa}</td>
          <td className="py-3 px-6 border border-gray-300">{patient.telefon}</td>
          <td className="py-3 px-6 border border-gray-300">{patient.email}</td>
          <td className="py-3 px-6 border border-gray-300">{formatDate(patient.data_inregistrarii)}</td>
          <td className="py-3 px-6 border border-gray-300">
            <button
              onClick={() => handleEditClick(patient)}
              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(patient.pacient_id)}
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
        Add Person
      </button>

      {/* Modal for Adding New Patient */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="nume"
                  value={newPatient.nume}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="prenume"
                  value={newPatient.prenume}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="data_nasterii"
                  value={newPatient.data_nasterii}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Sex</label>
                <select
                  name="sex"
                  value={newPatient.sex}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="adresa"
                  value={newPatient.adresa}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="telefon"
                  value={newPatient.telefon}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newPatient.email}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddPatient}
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

export default PacientiAdmin;
