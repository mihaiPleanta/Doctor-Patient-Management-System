const express = require("express");
const bcrypt = require("bcryptjs");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const app = express();

app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Allow cross-origin requests

// SQL Server connection configuration
const dbConfig = {
    server: "DESKTOP-Q97K3R2\\SQLEXPRESS", // Your server/instance name
    database: "Clinica",  // Your database name
    driver: "msnodesqlv8",  // Using msnodesqlv8 for Windows authentication
    options: {
        trustedConnection: true,  // Use this option for Windows Authentication
        encrypt: false,  // Set this to false for local development
        trustServerCertificate: true,  // If using a self-signed certificate
    },
};

// Connect to the database
sql.connect(dbConfig)
    .then(() => console.log("Connected to SQL Server"))
    .catch((err) => console.error("SQL Server connection error", err));

// Registration endpoint
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const checkUser = await sql.query`SELECT * FROM Users WHERE Username = ${username} OR Email = ${email}`;
        if (checkUser.recordset.length > 0) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await sql.query`INSERT INTO Users (Username, Email, Password) VALUES (${username}, ${email}, ${hashedPassword})`;

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Fetch the user from the database
        const result = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password from DB
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Return login success with admin flag
        res.status(200).json({ 
            message: "Login successful", 
            admin: user.admin || false // Include admin flag in response
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Fetch all patients
app.get("/patients", async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Pacienti`;
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add a new patient
app.post("/patients", async (req, res) => {
    const { nume, prenume, data_nasterii, sex, adresa, telefon, email } = req.body;

    try {
        const result = await sql.query`
            INSERT INTO Pacienti (nume, prenume, data_nasterii, sex, adresa, telefon, email)
            VALUES (${nume}, ${prenume}, ${data_nasterii}, ${sex}, ${adresa}, ${telefon}, ${email});
            SELECT SCOPE_IDENTITY() AS pacient_id;
        `;

        res.json({ pacient_id: result.recordset[0].pacient_id, ...req.body });
    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a patient's details
app.put("/patients/:id", async (req, res) => {
    const { id } = req.params;
    const { nume, prenume, data_nasterii, sex, adresa, telefon, email } = req.body;

    try {
        await sql.query`
            UPDATE Pacienti
            SET 
                nume = ${nume},
                prenume = ${prenume},
                data_nasterii = ${data_nasterii},
                sex = ${sex},
                adresa = ${adresa},
                telefon = ${telefon},
                email = ${email}
            WHERE pacient_id = ${id};
        `;

        res.status(200).json({ message: "Patient updated successfully" });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Delete a patient
app.delete("/patients/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query`DELETE FROM Pacienti WHERE pacient_id = ${id}`;
        res.status(204).send(); // No content response
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.get("/doctors", async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Medici`;
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/doctors", async (req, res) => {
    const { nume, prenume, specializare, telefon, email } = req.body;

    try {
        await sql.query`
            INSERT INTO Medici (nume, prenume, specializare, telefon, email)
            VALUES (${nume}, ${prenume}, ${specializare}, ${telefon}, ${email});
        `;
        res.status(201).json({ message: "Doctor added successfully" });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/doctors/:id", async (req, res) => {
    const { id } = req.params;
    const { nume, prenume, specializare, telefon, email } = req.body;

    try {
        await sql.query`
            UPDATE Medici
            SET 
                nume = ${nume},
                prenume = ${prenume},
                specializare = ${specializare},
                telefon = ${telefon},
                email = ${email}
            WHERE medic_id = ${id};
        `;
        res.status(200).json({ message: "Doctor updated successfully" });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/doctors/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query`DELETE FROM Medici WHERE medic_id = ${id}`;
        res.status(204).send(); // No content response
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/appointments", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                p.programare_id, 
                p.pacient_id, 
                p.medic_id, 
                CONVERT(VARCHAR, p.data_programarii, 23) AS data_programarii, 
                CONVERT(VARCHAR, p.ora_programarii, 8) AS ora_programarii, 
                p.status, 
                COALESCE(pac.nume, '') AS pacient_nume, 
                COALESCE(pac.prenume, '') AS pacient_prenume, 
                COALESCE(med.nume, '') AS medic_nume, 
                COALESCE(med.prenume, '') AS medic_prenume
            FROM Programari p
            LEFT JOIN Pacienti pac ON p.pacient_id = pac.pacient_id
            LEFT JOIN Medici med ON p.medic_id = med.medic_id
        `;

        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/appointments", async (req, res) => {
    const { pacient_id, medic_id, data_programarii, ora_programarii, status } = req.body;

    try {
        await sql.query`
            INSERT INTO Programari (pacient_id, medic_id, data_programarii, ora_programarii, status)
            VALUES (${pacient_id}, ${medic_id}, ${data_programarii}, ${ora_programarii}, ${status});
        `;
        res.status(201).json({ message: "Appointment added successfully" });
    } catch (error) {
        console.error("Error adding appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/appointments/:id", async (req, res) => {
    const { id } = req.params;
    const { pacient_id, medic_id, data_programarii, ora_programarii, status } = req.body;

    try {
        const result = await sql.query`
            UPDATE Programari
            SET 
                pacient_id = ${pacient_id},
                medic_id = ${medic_id},
                data_programarii = ${data_programarii},
                ora_programarii = ${ora_programarii},
                status = ${status}
            WHERE programare_id = ${id};
        `;

        console.log("Update query result:", result);
        res.status(200).json({ message: "Appointment updated successfully" });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

  
app.delete("/appointments/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query`DELETE FROM Programari WHERE programare_id = ${id}`;
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Fetch all prescriptions
app.get("/prescriptions", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                r.reteta_id, 
                r.pacient_id, 
                r.medic_id, 
                CONVERT(VARCHAR, r.data_emiterii, 23) AS data_emiterii, 
                r.detalii_reteta, 
                COALESCE(pac.nume, '') AS pacient_nume, 
                COALESCE(pac.prenume, '') AS pacient_prenume, 
                COALESCE(med.nume, '') AS medic_nume, 
                COALESCE(med.prenume, '') AS medic_prenume
            FROM Retete r
            LEFT JOIN Pacienti pac ON r.pacient_id = pac.pacient_id
            LEFT JOIN Medici med ON r.medic_id = med.medic_id
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add a new prescription
app.post("/prescriptions", async (req, res) => {
    const { pacient_id, medic_id, data_emiterii, detalii_reteta } = req.body;

    try {
        const result = await sql.query`
            INSERT INTO Retete (pacient_id, medic_id, data_emiterii, detalii_reteta)
            VALUES (${pacient_id}, ${medic_id}, ${data_emiterii}, ${detalii_reteta});
            SELECT SCOPE_IDENTITY() AS reteta_id;
        `;
        res.status(201).json({ message: "Prescription added successfully", reteta_id: result.recordset[0].reteta_id });
    } catch (error) {
        console.error("Error adding prescription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a prescription
app.put("/prescriptions/:id", async (req, res) => {
    const { id } = req.params;
    const { pacient_id, medic_id, data_emiterii, detalii_reteta } = req.body;

    try {
        await sql.query`
            UPDATE Retete
            SET 
                pacient_id = ${pacient_id},
                medic_id = ${medic_id},
                data_emiterii = ${data_emiterii},
                detalii_reteta = ${detalii_reteta}
            WHERE reteta_id = ${id};
        `;
        res.status(200).json({ message: "Prescription updated successfully" });
    } catch (error) {
        console.error("Error updating prescription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a prescription
app.delete("/prescriptions/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query`DELETE FROM Retete WHERE reteta_id = ${id}`;
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting prescription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/total-patients", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT COUNT(*) AS total_patients
            FROM Pacienti
        `;
        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching total patients:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/upcoming-appointments", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT COUNT(*) AS upcoming_appointments
            FROM Programari
            WHERE data_programarii >= GETDATE()
        `;
        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/active-doctors", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT COUNT(*) AS active_doctors
            FROM Medici
        `;
        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching active doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/popular-speciality", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 1
                m.specializare,
                COUNT(*) AS appointment_count
            FROM Programari p
            INNER JOIN Medici m ON p.medic_id = m.medic_id
            GROUP BY m.specializare
            ORDER BY appointment_count DESC
        `;
        res.json(result.recordset[0] || { specializare: "N/A", appointment_count: 0 });
    } catch (error) {
        console.error("Error fetching popular speciality:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/next-appointments", async (req, res) => {
    try {
      const result = await sql.query`
        SELECT TOP 10
          CONVERT(VARCHAR, data_programarii, 23) AS date,
          COUNT(*) AS count
        FROM Programari
        WHERE data_programarii >= GETDATE()
        GROUP BY data_programarii
        ORDER BY data_programarii ASC
      `;
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching next appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

app.get("/stats/specialities-distribution", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 5
                m.specializare,
                COUNT(*) AS count
            FROM Medici m
            INNER JOIN Programari p ON m.medic_id = p.medic_id
            GROUP BY m.specializare
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching specialities distribution:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/top-doctors", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 3
                m.medic_id,
                m.nume + ' ' + m.prenume AS doctor_name,
                m.specializare,
                (SELECT COUNT(*) 
                 FROM Programari p 
                 WHERE p.medic_id = m.medic_id) AS total_appointments
            FROM Medici m
            ORDER BY total_appointments DESC;
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching top doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/stats/top-patients", async (req, res) => {
    try {
        const result = await sql.query`
            SELECT TOP 3
                p.pacient_id,
                p.nume + ' ' + p.prenume AS pacient_name,
                p.telefon,
                p.email,
                p.adresa,
                COUNT(*) AS total_appointments,
                (SELECT COUNT(*) 
                 FROM Retete r 
                 WHERE r.pacient_id = p.pacient_id) AS total_prescriptions,
                (SELECT MAX(pr.data_programarii)
                 FROM Programari pr 
                 WHERE pr.pacient_id = p.pacient_id) AS last_appointment_date
            FROM Pacienti p
            INNER JOIN Programari pr ON p.pacient_id = pr.pacient_id
            GROUP BY 
                p.pacient_id, 
                p.nume, 
                p.prenume, 
                p.telefon, 
                p.email, 
                p.adresa
            ORDER BY total_appointments DESC;
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching top patients:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/stats/top-doctors-prescriptions", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT TOP 3
                m.medic_id,
                m.nume + ' ' + m.prenume AS doctor_name,
                AVG(prescriptions_per_patient) AS avg_prescriptions_per_patient
            FROM (
                SELECT
                    r.medic_id,
                    r.pacient_id,
                    COUNT(r.reteta_id) AS prescriptions_per_patient
                FROM Retete r
                GROUP BY r.medic_id, r.pacient_id
            ) AS subquery
            INNER JOIN Medici m ON subquery.medic_id = m.medic_id
            GROUP BY m.medic_id, m.nume, m.prenume
            ORDER BY avg_prescriptions_per_patient DESC;
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching top doctors by prescriptions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/stats/doctors-appointments-status", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT TOP 5
                m.medic_id,
                m.nume + ' ' + m.prenume AS doctor_name,
                (SELECT COUNT(*)
                 FROM Programari p
                 WHERE p.medic_id = m.medic_id
                   AND p.status = 'Finalizat') AS completed_appointments,
                (SELECT COUNT(*)
                 FROM Programari p
                 WHERE p.medic_id = m.medic_id
                   AND p.status = 'Programat') AS active_appointments
            FROM Medici m
            ORDER BY completed_appointments DESC;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching doctors' appointments status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
