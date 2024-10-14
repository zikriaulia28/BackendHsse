const express = require("express");
const router = express.Router();
const { createSafetyRecord, getAllSafetyRecords, updateSafetyRecord, deleteSafetyRecord } = require('../controllers/safetyRecordController')

// Rute untuk mendapatkan semua rekaman safety
router.get("/", getAllSafetyRecords);

// Rute untuk menambahkan rekaman safety
router.post("/", createSafetyRecord);

// Rute untuk memperbarui rekaman safety
router.put("/:id", updateSafetyRecord);

// Rute untuk menghapus rekaman safety
router.delete("/:id", deleteSafetyRecord);

module.exports = router;
