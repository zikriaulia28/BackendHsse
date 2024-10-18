const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Konfigurasi Cloudinary dengan API key dan secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Konfigurasi CloudinaryStorage untuk mendukung PDF dan gambar
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'usa-temuan', // Folder untuk menyimpan file di Cloudinary
    resource_type: 'auto', // Mendukung semua jenis file (pdf, image, dll.)
    format: async (req, file) => {
      // Mengambil format file sesuai dengan ekstensi asli (jpeg, png, pdf, dll.)
      const ext = file.originalname.split('.').pop();
      return ext; // Kembalikan ekstensi asli file
    },
    public_id: (req, file) => {
      // Atur nama file di Cloudinary tanpa menambahkan ekstensi ganda
      return file.originalname.replace(/\.[^/.]+$/, ""); // Menghapus ekstensi jika ada
    }
  },
});

module.exports = { cloudinary, storage };
