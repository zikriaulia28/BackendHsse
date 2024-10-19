const prisma = require('../../lib/prismaClient');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const getAllUsers = async (req, res) => {
  try {
    // Mengambil semua pengguna dari database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        position: true,
        name: true,
      }, // Select fields to return, exclude sensitive data like password
    });

    res.status(200).json(users); // Mengirimkan data pengguna
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
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

// Update user (exclude password)
const updateUser = async (req, res) => {
  const { id } = req.params; // Get user ID from URL parameters
  const { email, name, role, position } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) }, // Ensure the ID is a number
      data: { email, name, role, position },
    });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// Ekspor fungsi
module.exports = {
  registerUser,
  loginUser,
  changePassword, // Tambahkan ini
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser
};
