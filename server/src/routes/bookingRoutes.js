const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createBooking,
  getPassengerBookings,
  getDriverRides,
  getBookingById,
  completeRide
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/passenger/my", protect, getPassengerBookings);
router.get("/driver/my", protect, getDriverRides);
router.get("/:id", protect, getBookingById);     // ✅ FIXED
router.put("/:id/complete", protect, completeRide);

module.exports = router;
