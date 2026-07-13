const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createRentalStripeIntent,
  confirmRentalPayment,
} = require("../controllers/rentalPaymentController");

// Create Stripe Payment Intent
router.post(
  "/rental-stripe-intent",
  protect,
  createRentalStripeIntent
);

// Confirm Payment & Create Booking
router.post(
  "/rental-stripe-confirm",
  protect,
  confirmRentalPayment
);

module.exports = router;