const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createStripeIntent,
  confirmStripePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/stripe-intent", protect, createStripeIntent);
router.post("/stripe-confirm", protect, confirmStripePayment);

module.exports = router;
