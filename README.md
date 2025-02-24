# Doctor Patient Management System

## Overview

The Family Doctor Patient Management System is a web application designed to help family doctors efficiently manage patients, appointments, consultations and prescriptions. The application provides a secure and centralized platform for handling patient records and medical history.

## Features

### Frontend (React.js)

- **User Authentication**: Login and registration system for patients and admins.
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



