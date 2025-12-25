const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");

const {
  createRide,
  getAvailableRides,
  getDriverRides,
  getDriverRideDetails,
  sendSOS,
  addReview
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

// DRIVER – RIDE DETAILS
router.get("/driver/:id/details", protect, getDriverRideDetails);

// SOS
router.post("/:rideId/sos", protect, sendSOS);

// REVIEW
router.post("/:rideId/review", protect, addReview);

module.exports = router;
