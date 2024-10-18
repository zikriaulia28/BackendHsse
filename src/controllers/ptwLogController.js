const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

// Konfigurasi multer untuk mengunggah file
const upload = multer({
  storage: storage, // Tempat penyimpanan file scan
  limits: { fileSize: 2 * 1024 * 1024 }, // Maksimum ukuran file 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/; // Hanya izinkan gambar atau PDF
    const extname = fileTypes.test(file.mimetype);
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('File format not supported. Please upload JPEG, PNG, or PDF.'));
    }
  }
});

// Mendapatkan semua PTWLog
// Fungsi untuk membuat PTW baru
const createPTW = [
  upload.single('scan'), // Upload 1 file untuk scan dokumen
  async (req, res) => {
    try {
      const { date, noPTW, workDescription, section, typeOfWork, receivingAuthority, status, hsseRemark } = req.body;

      const scanUrl = req.file ? req.file.url : null; // Mengambil URL scan jika ada

      const newPTW = await prisma.pTWLog.create({
        data: {
          date: new Date(date),
          noPTW,
          workDescription,
          section,
          typeOfWork,
          receivingAuthority,
          status,
          hsseRemark,
          scan: scanUrl,
        },
      });

      res.status(201).json(newPTW);
    } catch (error) {
      console.error('Error creating PTW:', error);
      res.status(500).json({ error: 'Gagal membuat PTW' });
    }
  }
];

// Fungsi untuk mendapatkan semua PTW
const getAllPTWs = async (req, res) => {
  try {
    const ptws = await prisma.pTWLog.findMany();
    res.status(200).json(ptws);
  } catch (error) {
    console.error('Error getting PTWs:', error);
    res.status(500).json({ error: 'Gagal mendapatkan daftar PTW' });
  }
};

// Fungsi untuk mendapatkan PTW berdasarkan ID
const getPTWById = async (req, res) => {
  const { id } = req.params;
  try {
    const ptw = await prisma.pTWLog.findUnique({
      where: { id: parseInt(id) },
    });

    if (ptw) {
      res.status(200).json(ptw);
    } else {
      res.status(404).json({ error: 'PTW tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error getting PTW by ID:', error);
    res.status(500).json({ error: 'Gagal mendapatkan PTW berdasarkan ID' });
  }
};

// Fungsi untuk memperbarui PTW berdasarkan ID
const updatePTW = [
  upload.single('scan'), // Upload file baru jika ada
  async (req, res) => {
    const { id } = req.params;
    const { date, noPTW, workDescription, section, typeOfWork, receivingAuthority, status, hsseRemark } = req.body;

    const updatedData = {
      date: date ? new Date(date) : undefined,
      noPTW,
      workDescription,
      section,
      typeOfWork,
      receivingAuthority,
      status,
      hsseRemark,
    };

    if (req.file) {
      updatedData.scan = req.file.path; // Update file scan jika ada
    }

    try {
      const updatedPTW = await prisma.pTWLog.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });

      res.status(200).json(updatedPTW);
    } catch (error) {
      console.error('Error updating PTW:', error);
      res.status(500).json({ error: 'Gagal memperbarui PTW' });
    }
  }
];

// Fungsi untuk menghapus PTW berdasarkan ID
const deletePTW = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPTW = await prisma.pTWLog.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json(deletedPTW);
  } catch (error) {
    console.error('Error deleting PTW:', error);
    res.status(500).json({ error: 'Gagal menghapus PTW' });
  }
};

module.exports = {
  createPTW,
  getAllPTWs,
  getPTWById,
  updatePTW,
  deletePTW
}