const express = require("express");
const router = express.Router();

const {
  completeDriverProfile,
  updateDriverProfile,
  addOrUpdateVehicle,
  getMyVehicles,
} = require("../controllers/driverController");

const { protect } = require("../middleware/authMiddleware");

// 🔹 Existing (DO NOT REMOVE)
router.post("/complete-profile", protect, completeDriverProfile);

// 🔹 NEW: Driver personal update
router.put("/profile", protect, updateDriverProfile);

// 🔹 NEW: Driver vehicle update
router.post("/vehicle", protect, addOrUpdateVehicle);

router.get("/vehicles", protect, getMyVehicles);

module.exports = router;
