const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig'); // Import cloudinary config

// Konfigurasi multer untuk upload file
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maksimum ukuran file 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Hanya izinkan gambar berformat JPEG dan PNG
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extname) {
      return cb(null, true); // File diterima
    } else {
      cb(new Error('File format not supported. Please upload JPEG or PNG images.'));
    }
  },
});

// Get all USA Temuan records
exports.getAllUSATemuan = async (req, res) => {
  try {
    const usaTemuan = await prisma.uSATemuan.findMany();
    res.status(200).json(usaTemuan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch USA Temuan records." });
  }
};

// Get a single USA Temuan by ID
exports.getUSATemuanById = async (req, res) => {
  const { id } = req.params;
  try {
    const temuan = await prisma.uSATemuan.findUnique({
      where: { id: parseInt(id) },
    });
    if (temuan) {
      res.status(200).json(temuan);
    } else {
      res.status(404).json({ error: "USA Temuan record not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch USA Temuan record." });
  }
};

// Create a new USA Temuan with file upload
exports.createUSATemuan = [
  upload.fields([{ name: 'fotoSebelum' }, { name: 'fotoClosing' }]), // Upload multiple files
  async (req, res) => {
    console.log("Body data:", req.body); // Log untuk mengecek data di body
    console.log("Files data:", req.files); // Log untuk mengecek file yang diupload

    const { nama, status, judul, lokasiTemuan, areaSpesifik, jenisTemuan, uscConditionTerkait, usaPracticeTerkait, penyebabKetidaksesuaian, tindakanPerbaikan, tindakanPencegahan, waktu, statusAkhir } = req.body;

    try {
      const fotoSebelumUrl = req.files['fotoSebelum'] ? req.files['fotoSebelum'][0].path : null;
      const fotoClosingUrl = req.files['fotoClosing'] ? req.files['fotoClosing'][0].path : null;

      // Set statusAkhir to null if not provided
      const finalStatusAkhir = statusAkhir || null;

      const newTemuan = await prisma.uSATemuan.create({
        data: {
          nama,
          status,
          judul,
          lokasiTemuan,
          areaSpesifik,
          jenisTemuan,
          uscConditionTerkait,
          usaPracticeTerkait,
          penyebabKetidaksesuaian,
          tindakanPerbaikan,
          tindakanPencegahan,
          fotoSebelum: fotoSebelumUrl,
          fotoClosing: fotoClosingUrl,
          waktu: new Date(waktu),
          statusAkhir: finalStatusAkhir, // Use null if statusAkhir is empty
        },
      });
      res.status(201).json(newTemuan);
    } catch (error) {
      console.error("Error creating USA Temuan:", error);
      res.status(500).json({ error: "Failed to create USA Temuan record." });
    }
  },
];




// Update a USA Temuan by ID (Partial Update with PATCH)
exports.updateUSATemuan = [
  upload.fields([{ name: 'fotoSebelum' }, { name: 'fotoClosing' }]), // Handle file uploads
  async (req, res) => {
    const { id } = req.params;

    // Ambil hanya data yang ingin diperbarui dari req.body
    const updatedData = {};
    const fields = [
      "nama", "status", "judul", "lokasiTemuan", "areaSpesifik",
      "jenisTemuan", "uscConditionTerkait", "usaPracticeTerkait",
      "penyebabKetidaksesuaian", "tindakanPerbaikan", "tindakanPencegahan",
      "waktu", "statusAkhir"
    ];

    // Masukkan hanya data yang ada di req.body
    fields.forEach(field => {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    });

    if (req.files['fotoSebelum']) {
      updatedData.fotoSebelum = req.files['fotoSebelum'][0].path;
      console.log("Uploaded fotoSebelum:", updatedData.fotoSebelum);
    }

    if (req.files['fotoClosing']) {
      updatedData.fotoClosing = req.files['fotoClosing'][0].path;
      console.log("Uploaded fotoClosing:", updatedData.fotoClosing);
    }
    console.log("Body data:", req.body);
    console.log("Files data:", req.files);


    // Update data di database
    try {
      const updatedTemuan = await prisma.uSATemuan.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });
      res.status(200).json(updatedTemuan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update USA Temuan record." });
    }
  }
];


// Delete a USA Temuan by ID
exports.deleteUSATemuan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemuan = await prisma.uSATemuan.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json(deletedTemuan);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete USA Temuan record." });
  }
};
