import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    activeDoctors: 0,
    popularSpeciality: { specializare: "N/A", appointment_count: 0 },
  });
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [specialitiesData, setSpecialitiesData] = useState([]);
  const [topPatients, setTopPatients] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [doctorsAppointmentsStatus, setDoctorsAppointmentsStatus] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, appointmentsRes, doctorsRes, specialityRes, nextAppointmentsRes, topPatientsRes, topDoctorsRes, doctorsAppointmentsStatusRes] = await Promise.all([
          axios.get("http://localhost:5000/stats/total-patients"),
          axios.get("http://localhost:5000/stats/upcoming-appointments"),
          axios.get("http://localhost:5000/stats/active-doctors"),
          axios.get("http://localhost:5000/stats/popular-speciality"),
          axios.get("http://localhost:5000/stats/next-appointments"),
          axios.get("http://localhost:5000/stats/top-patients"),
          axios.get("http://localhost:5000/stats/top-doctors-prescriptions"),
          axios.get("http://localhost:5000/stats/doctors-appointments-status"), // New request
        ]);

        setStats({
          totalPatients: patientsRes.data.total_patients,
          upcomingAppointments: appointmentsRes.data.upcoming_appointments,
          activeDoctors: doctorsRes.data.active_doctors,
          popularSpeciality: specialityRes.data,
        });

        setAppointmentsData(nextAppointmentsRes.data);
        const specialitiesDataRes = await axios.get("http://localhost:5000/stats/specialities-distribution");
        setSpecialitiesData(specialitiesDataRes.data);
        setTopPatients(topPatientsRes.data);
        setTopDoctors(topDoctorsRes.data);
        setDoctorsAppointmentsStatus(doctorsAppointmentsStatusRes.data); // Setting data for doctors' appointments status
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  const lineChartData = {
    labels: appointmentsData.map((data) => data.date),
    datasets: [
      {
        label: "Appointments per Day",
        data: appointmentsData.map((data) => data.count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates of Next Appointments",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Appointments",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieChartData = {
    labels: specialitiesData.map((data) => data.specializare),
    datasets: [
      {
        data: specialitiesData.map((data) => data.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="bg-blue-600 text-white rounded-lg p-6 shadow-md mb-6">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-sm">Manage your clinic's data efficiently and effectively.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Patients</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Appointments</h2>
          <p className="text-3xl font-bold text-green-500">{stats.upcomingAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Doctors</h2>
          <p className="text-3xl font-bold text-red-500">{stats.activeDoctors}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Popular Specialty</h2>
          <p className="text-lg font-semibold text-gray-700">{stats.popularSpeciality.specializare}</p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Next Appointments Overview</h3>
            <div style={{ height: "300px" }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Specialties Distribution</h3>
            <div style={{ height: "300px" }}>
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 3 Patients</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Patient Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Total Appointments</th>
                <th className="px-4 py-2 border">Last Appointment</th>
              </tr>
            </thead>
            <tbody>
              {topPatients.map((patient) => (
                <tr key={patient.pacient_id}>
                  <td className="px-4 py-2 border">{patient.pacient_name}</td>
                  <td className="px-4 py-2 border">{patient.telefon}</td>
                  <td className="px-4 py-2 border">{patient.email}</td>
                  <td className="px-4 py-2 border text-center">{patient.total_appointments}</td>
                  <td className="px-4 py-2 border text-center">{formatDate(patient.last_appointment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 3 Doctors by Prescriptions</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Doctor Name</th>
                <th className="px-4 py-2 border">Average Prescriptions per Patient</th>
              </tr>
            </thead>
            <tbody>
              {topDoctors.map((doctor) => (
                <tr key={doctor.medic_id}>
                  <td className="px-4 py-2 border">{doctor.doctor_name}</td>
                  <td className="px-4 py-2 border text-center">{doctor.avg_prescriptions_per_patient.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointments Status per Doctor</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Doctor Name</th>
                <th className="px-4 py-2 border">Completed Appointments</th>
                <th className="px-4 py-2 border">Active Appointments</th>
              </tr>
            </thead>
            <tbody>
              {doctorsAppointmentsStatus.map((doctor) => (
                <tr key={doctor.medic_id}>
                  <td className="px-4 py-2 border">{doctor.doctor_name}</td>
                  <td className="px-4 py-2 border text-center">{doctor.completed_appointments}</td>
                  <td className="px-4 py-2 border text-center">{doctor.active_appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
