import React, { useEffect, useState } from "react";
import axios from "axios";

const ProgramariAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editableAppointment, setEditableAppointment] = useState({});
  const [newAppointment, setNewAppointment] = useState({
    pacient_id: "",
    medic_id: "",
    data_programarii: "",
    ora_programarii: "",
    status: "Programat",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get("http://localhost:5000/appointments")
      .then((response) => {
        const formattedAppointments = response.data.map((appointment) => ({
          ...appointment,
          data_programarii: new Date(appointment.data_programarii).toISOString().split("T")[0],
          ora_programarii: appointment.ora_programarii.slice(0, 5),
        }));
        setAppointments(formattedAppointments);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  };

  const handleAddAppointment = () => {
    axios
      .post("http://localhost:5000/appointments", newAppointment)
      .then(() => {
        fetchAppointments();
        setShowModal(false);
        setNewAppointment({
          pacient_id: "",
          medic_id: "",
          data_programarii: "",
          ora_programarii: "",
          status: "",
        });
      })
      .catch((error) => {
        console.error("Error adding appointment:", error);
        alert("Failed to add appointment. Check the logs for more details.");
      });
  };

  const handleEditClick = (appointment) => {
    setEditRowId(appointment.programare_id);
    setEditableAppointment({
      pacient_id: appointment.pacient_id || "",
      medic_id: appointment.medic_id || "",
      data_programarii: appointment.data_programarii || "",
      ora_programarii: appointment.ora_programarii || "",
      status: appointment.status || "",
    });
  };

  const handleDeleteClick = (id) => {
    axios
      .delete(`http://localhost:5000/appointments/${id}`)
      .then(() => {
        fetchAppointments();
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = (id) => {
    axios
      .put(`http://localhost:5000/appointments/${id}`, editableAppointment)
      .then(() => {
        fetchAppointments(); // Reîncarcă lista
        setEditRowId(null); // Ieși din modul de editare
      })
      .catch((error) => {
        console.error("Error saving appointment:", error);
        alert("Failed to save appointment. Check the logs for more details.");
      });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Appointments</h1>
        <table className="w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border border-gray-300">Nr.</th>
              <th className="py-3 px-6 border border-gray-300">Patient</th>
              <th className="py-3 px-6 border border-gray-300">Doctor</th>
              <th className="py-3 px-6 border border-gray-300">Date</th>
              <th className="py-3 px-6 border border-gray-300">Time</th>
              <th className="py-3 px-6 border border-gray-300">Status</th>
              <th className="py-3 px-6 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment.programare_id} className="hover:bg-gray-100">
                {editRowId === appointment.programare_id ? (
                  <>
                    <td className="py-3 px-6 border border-gray-300">{index + 1}</td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="pacient_id"
                        value={editableAppointment.pacient_id || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="medic_id"
                        value={editableAppointment.medic_id || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="date"
                        name="data_programarii"
                        value={editableAppointment.data_programarii || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="time"
                        name="ora_programarii"
                        value={editableAppointment.ora_programarii || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <input
                        type="text"
                        name="status"
                        value={editableAppointment.status || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <button
                        onClick={() => handleSaveClick(appointment.programare_id)}
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
                    <td className="py-3 px-6 border border-gray-300">
                      {appointment.pacient_nume} {appointment.pacient_prenume}
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      {appointment.medic_nume} {appointment.medic_prenume}
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      {appointment.data_programarii}
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      {appointment.ora_programarii}
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      {appointment.status}
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      <button
                        onClick={() => handleEditClick(appointment)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(appointment.programare_id)}
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
        Add Appointment
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Appointment</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  name="pacient_id"
                  value={newAppointment.pacient_id}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Doctor ID</label>
                <input
                  type="text"
                  name="medic_id"
                  value={newAppointment.medic_id}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="data_programarii"
                  value={newAppointment.data_programarii}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  name="ora_programarii"
                  value={newAppointment.ora_programarii}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <input
                  type="text"
                  name="status"
                  value={newAppointment.status}
                  onChange={handleNewInputChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddAppointment}
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

export default ProgramariAdmin;
