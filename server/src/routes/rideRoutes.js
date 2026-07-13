const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const { getRideDetails } = require("../controllers/rideController");

// const {
//   createRide,
//   getAvailableRides,
//   getDriverRides,
//   getDriverRideDetails,
//   sendSOS,
//   addReview
// } = require("../controllers/rideController");
const {
  createRide,
  getAvailableRides,
  getDriverRides,
  getDriverRideDetails,
  sendSOS,
  addReview,
  startRide,
  completeRide,
  getDriverStats,
  getActiveRide
} = require("../controllers/rideController");

const router = express.Router();

// CREATE RIDE
router.post(
  "/",
  protect,
  [
    body("origin").notEmpty(),
    body("destination").notEmpty(),
    body("date").notEmpty(),
    body("seatsAvailable").isInt({ min: 1 }),
    body("pricePerSeat").isFloat({ min: 0 }),
  ],
  createRide
);

// PASSENGER – AVAILABLE RIDES
router.get("/", protect, getAvailableRides);

// DRIVER – MY RIDES
router.get("/driver/my", protect, getDriverRides);

// DRIVER – STATS
router.get("/driver/stats", protect, getDriverStats);

// DRIVER – RIDE DETAILS
router.get("/driver/:id/details", protect, getDriverRideDetails);
router.get("/active/current", protect, getActiveRide);
router.get("/:id", protect, getRideDetails);

// SOS
router.post("/:rideId/sos", protect, sendSOS);

// REVIEW
router.post("/:rideId/review", protect, addReview);

// DRIVER – START RIDE
router.patch("/:id/start", protect, startRide);

// DRIVER – COMPLETE RIDE
router.patch("/:id/complete", protect, completeRide);


module.exports = router;

