const express = require('express');
const { loginUser, registerUser, changePassword, logoutUser } = require('../controllers/userController')

const router = express.Router();

// Endpoint untuk registrasi pengguna
router.post("/register", registerUser);

// Endpoint untuk login pengguna
router.post("/login", loginUser);

router.put("/change-password", changePassword);

// Endpoint untuk logout
router.post("/logout", logoutUser);

module.exports = router; 