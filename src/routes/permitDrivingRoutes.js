const express = require("express");
const {
  getAllPermitDriving,
  getPermitDrivingDetails,
  createPermitDriving,
  updatePermitDrivingStatus,
  getTotalKmUsage,
  createUsageLog
} = require("../controllers/permitDrivingController");

const router = express.Router();

router.get("/", getAllPermitDriving);
router.get("/details", getPermitDrivingDetails);
router.post("/", createPermitDriving);
router.put("/:id/status", updatePermitDrivingStatus);
router.get("/usage", getTotalKmUsage);
router.post("/usageLog", createUsageLog);

module.exports = router;
