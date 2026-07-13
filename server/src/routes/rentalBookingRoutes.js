const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
   getOwnerRentalBookings,
  getMyRentalBookings,
  getRentalBookingDetails,
   generatePickupOTP,
   verifyPickupOTP,
   generateReturnOTP,
   verifyReturnOTP,
   cancelRentalBooking,
} = require("../controllers/rentalBookingController");

router.get(
  "/owner",
  protect,
  getOwnerRentalBookings
);
router.get(
  "/my",
  protect,
  getMyRentalBookings
);
router.get(
  "/:bookingId",
  protect,
  getRentalBookingDetails
);
router.put(
  "/pickup-otp/:bookingId",
  protect,
  generatePickupOTP
);
router.put(
  "/verify-pickup/:bookingId",
  protect,
  verifyPickupOTP
);
router.put(
  "/return-otp/:bookingId",
  protect,
  generateReturnOTP
);
router.put(
  "/verify-return/:bookingId",
  protect,
  verifyReturnOTP
);
router.put(
    "/cancel/:bookingId",
    protect,
    cancelRentalBooking
);

module.exports = router;