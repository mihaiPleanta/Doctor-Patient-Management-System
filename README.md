# Family Doctor Patient Management System

## Overview

The Family Doctor Patient Management System is a web application designed to help family doctors efficiently manage patients, appointments, consultations, prescriptions, and medications. The application provides a secure and centralized platform for handling patient records and medical history.

## Features

### Frontend (React.js)

- **User Authentication**: Login and registration system for doctors and admins.
- **Home Page**: Overview dashboard with key functionalities.
- **Admin Panel**: Restricted section for managing doctors, patients, and appointments.
- **Patient Management**: Add, update, and remove patient records.
- **Doctor Management**: List and manage doctors.
- **Appointments**: Schedule, update, and cancel appointments.
- **Prescriptions**: Issue and track prescriptions for patients.

### Backend (Node.js + Express + SQL Server)

- **Authentication**: Secure login and registration using bcrypt password hashing.
- **Database Integration**: Uses Microsoft SQL Server for storing patient and medical data.
- **API Endpoints**:
  - `/register` & `/login`: User authentication.
  - `/patients`: Manage patient data.
  - `/doctors`: Manage doctor records.
  - `/appointments`: CRUD operations for appointments.
  - `/prescriptions`: Prescription tracking.
  - `/stats`: Retrieve key metrics like total patients, upcoming appointments, and doctor performance.

## Technologies Used

- **Frontend**: React.js, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Microsoft SQL Server
- **Authentication**: Bcrypt.js for password hashing
- **Other Dependencies**: cors, mssql, dotenv

## Installation & Setup

### Prerequisites

- Node.js installed
- SQL Server running

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/your-project.git
   cd your-project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure the database connection in `server.js`:
   ```js
   const dbConfig = {
       server: "YOUR_SERVER_NAME",
       database: "Clinica",
       driver: "msnodesqlv8",
       options: {
           trustedConnection: true,
           encrypt: false,
           trustServerCertificate: true,
       },
   };
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```
5. Start the frontend application:
   ```sh
   npm start
   ```

## Usage

- **Visit** `http://localhost:3000/` to access the application.
- **Login/Register** as a user.
- **Navigate** through the dashboard to manage patients, doctors, and appointments.

## Future Improvements

- Implement role-based access control for different user types.
- Add email notifications for appointments.
- Improve UI/UX with additional features.

## License

This project is licensed under the MIT License.

---

For any issues or contributions, feel free to submit a pull request or open an issue!

