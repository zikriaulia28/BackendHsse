// src/routes/ptwRoutes.js

const express = require('express');
const { createPTW, deletePTW, getAllPTWs, getPTWById, updatePTW } = require('../controllers/ptwLogController');

const router = express.Router();

// Route untuk menambahkan PTW baru
router.post('/', createPTW);

// Route untuk mendapatkan semua PTW
router.get('/', getAllPTWs);

// Route untuk mendapatkan PTW berdasarkan ID
router.get('/:id', getPTWById);

// Route untuk memperbarui PTW berdasarkan ID
router.patch('/:id', updatePTW);

// Route untuk menghapus PTW berdasarkan ID
router.delete('/:id', deletePTW);

module.exports = router;
