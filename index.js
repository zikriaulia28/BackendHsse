// src/index.js (atau file utama Anda)
const express = require("express");
const cors = require("cors");
const permitDrivingRoutes = require("./src/routes/permitDrivingRoutes");
const carRoutes = require("./src/routes/carRoutes");
const userRoutes = require("./src/routes/userRoutes");
const safetyRecordRoutes = require("./src/routes/safetyRecordRoutes");
const usaTemuanRoutes = require('./src/routes/usaTemuanRoutes');
const ptwRoutes = require('./src/routes/ptwRoutes');

const app = express();

// Middleware CORS untuk mengizinkan semua asal
app.use(cors({
  origin: (origin, callback) => {
    // Mengizinkan semua origin
    callback(null, true);
  },
  credentials: true, // Mengizinkan cookies dan credentials
}));

app.use(express.json());

// Endpoint sambutan untuk root API
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API!",
    description: "This is the welcome page for your API. You can access various endpoints from here.",
  });
});

// Menggunakan rute permitDriving
app.use("/permitDriving", permitDrivingRoutes);

// Menggunakan rute untuk mobil
app.use("/cars", carRoutes);

// Menggunakan rute untuk pengguna
app.use("/users", userRoutes); // Menambahkan prefix "/users" pada semua rute pengguna

// Menggunakan rute untuk catatan keselamatan
app.use("/safetyRecords", safetyRecordRoutes); // Tambahkan ini

app.use('/usaTemuan', usaTemuanRoutes);

app.use('/ptw', ptwRoutes);


// Menjalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
