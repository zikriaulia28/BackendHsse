const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Konfigurasi Cloudinary dengan API key dan secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Konfigurasi CloudinaryStorage untuk memastikan ekstensi tidak ditambahkan dua kali
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'usa-temuan',
    format: async (req, file) => {
      // Pastikan ekstensi yang sesuai diambil dari file asli
      const ext = file.originalname.split('.').pop();
      return ext; // Format sesuai ekstensi asli (jpeg, png)
    },
    public_id: (req, file) => {
      // Atur nama file sesuai keperluan, pastikan tidak ada ekstensi ganda
      return file.originalname.replace(/\.[^/.]+$/, ""); // Menghapus ekstensi jika ada
    }
  },
});


module.exports = { cloudinary, storage };
