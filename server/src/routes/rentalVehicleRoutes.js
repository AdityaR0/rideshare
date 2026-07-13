const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createRentalVehicle,
  getMyRentalVehicles,
  getAllRentalVehicles,
  getRentalVehicleById,
  deleteRentalVehicle,
  updateRentalVehicle,
  toggleVehicleStatus,
} = require("../controllers/rentalVehicleController");

// ==========================
// CREATE RENTAL VEHICLE
// ==========================

// router.post("/", protect, createRentalVehicle);
router.post(
    "/",
    protect,
    upload.single("image"),
    createRentalVehicle
);

// ==========================
// GET ALL VEHICLES
// ==========================

router.get("/", getAllRentalVehicles);

// ==========================
// GET MY RENTAL VEHICLES
// ==========================

router.get("/my", protect, getMyRentalVehicles);

// ==========================
// UPDATE RENTAL VEHICLE
// ==========================
router.get("/:id", getRentalVehicleById);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateRentalVehicle
);

// ==========================
// DELETE RENTAL VEHICLE
// ==========================

router.delete("/:id", protect, deleteRentalVehicle);
router.put(
    "/toggle/:id",
    protect,
    toggleVehicleStatus
);

module.exports = router;