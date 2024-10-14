const express = require("express");
const { createCar, getAllCars } = require("../controllers/carController");

const router = express.Router();

router.post("/", createCar);
router.get("/", getAllCars);

module.exports = router;
