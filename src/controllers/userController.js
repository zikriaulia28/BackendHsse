const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET; // Pastikan ini diatur di file .env

// Endpoint untuk registrasi pengguna
const registerUser = async (req, res) => {
  const { email, password, role, position, name } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        position,
        name
      },
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);

    // Menangani kesalahan duplikasi email
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Error creating user" });
  }
};

// Endpoint untuk login pengguna
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Temukan pengguna berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

// Endpoint untuk mengubah password pengguna
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // Validasi input
  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "User ID, old password, and new password are required" });
  }

  try {
    // Temukan pengguna berdasarkan ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Bandingkan password lama
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password pengguna
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Error changing password" });
  }
};

// Endpoint untuk logout pengguna
const logoutUser = (req, res) => {
  // Menghapus cookie token
  res.clearCookie("token"); // Ganti "token" dengan nama cookie yang Anda gunakan
  res.json({ message: "User logged out successfully" });
};

// Ekspor fungsi
module.exports = {
  registerUser,
  loginUser,
  changePassword, // Tambahkan ini
  logoutUser
};
