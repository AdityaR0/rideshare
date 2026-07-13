const express = require("express");
const { protect } = require("../middleware/authMiddleware");

// const {
//   createBooking,
//   getPassengerBookings,
//   getDriverRides,
//   getBookingById,
//   completeRide
// } = require("../controllers/bookingController");
const {
  createBooking,
  getPassengerBookings,
  // getDriverRides,
  getDriverRideDetails,
  getBookingById,
  completeRide,
  cancelBooking,
  getPassengerStats
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/passenger/my", protect, getPassengerBookings);
// PASSENGER – STATS
router.get("/passenger/stats", protect, getPassengerStats);
// router.get("/driver/my", protect, getDriverRides);
router.get("/driver/:id/details", protect, getDriverRideDetails);
router.get("/:id", protect, getBookingById);     // ✅ FIXED
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/complete", protect, completeRide);


module.exports = router;
