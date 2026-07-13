const RentalBooking = require("../models/RentalBooking");
const Notification = require("../models/Notification");
const RentalVehicle = require("../models/RentalVehicle");

// ============================================
// GET OWNER RENTAL BOOKINGS
// ============================================

exports.getOwnerRentalBookings = async (req, res) => {
  try {

    const bookings = await RentalBooking.find({
      owner: req.user.id,
    })
      .populate("vehicle")
      .populate("passenger", "name email phone")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      bookings,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ============================================
// GET PASSENGER RENTAL BOOKINGS
// ============================================

exports.getMyRentalBookings = async (req, res) => {
  try {

    const bookings = await RentalBooking.find({
      passenger: req.user.id,
    })
      .populate("vehicle")
      .populate("owner", "name phone")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      bookings,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ============================================
// GET SINGLE RENTAL BOOKING
// ============================================

exports.getRentalBookingDetails = async (req, res) => {

  try {

    const booking = await RentalBooking.findById(req.params.bookingId)

      .populate("vehicle")

      .populate("owner", "name phone email")

      .populate("passenger", "name phone email");

    if (!booking) {

      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    }

    res.status(200).json({
      success: true,
      booking,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};
// ============================================
// GENERATE PICKUP OTP
// ============================================

exports.generatePickupOTP = async (req, res) => {

  try {

    const booking = await RentalBooking.findById(
      req.params.bookingId
    );

    if (!booking) {

      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    }

    // Only owner can generate OTP

    if (booking.owner.toString() !== req.user.id) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });

    }

    // Already generated

    if (booking.pickupOTP) {

      return res.json({
        success: true,
        otp: booking.pickupOTP,
      });

    }

    // Generate random 6 digit OTP

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    booking.pickupOTP = otp;

    await booking.save();

    // Create Notification

    await Notification.create({

      user: booking.passenger,

      message: `🔑 Pickup OTP: ${otp}`,

    });

    res.json({

      success: true,

      otp,

      message: "Pickup OTP generated",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// ============================================
// VERIFY PICKUP OTP
// ============================================

exports.verifyPickupOTP = async (req, res) => {

  try {

    const { otp } = req.body;

    const booking = await RentalBooking.findById(
      req.params.bookingId
    );

    if (!booking) {

      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    }

    // Only vehicle owner can verify

    if (booking.owner.toString() !== req.user.id) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });

    }

    // Already verified

    if (booking.pickupVerified) {

      return res.json({
        success: true,
        message: "Pickup already verified",
      });

    }

    // Wrong OTP

    if (booking.pickupOTP !== otp) {

      return res.status(400).json({
        success: false,
        message: "Invalid Pickup OTP",
      });

    }

    // Verify Pickup

    booking.pickupVerified = true;

    booking.bookingStatus = "ACTIVE";

    await booking.save();

    // Passenger Notification

    await Notification.create({

      user: booking.passenger,

      message:
        "✅ Pickup Verified. Enjoy your ride!",

    });

    res.json({

      success: true,

      message: "Pickup Verified Successfully",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// ============================================
// GENERATE RETURN OTP
// ============================================

exports.generateReturnOTP = async (req, res) => {

  try {

    const booking = await RentalBooking.findById(
      req.params.bookingId
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only owner can generate OTP

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Rental must be ACTIVE

    if (booking.bookingStatus !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Rental is not active",
      });
    }

    // Already generated

    if (booking.returnOTP) {
      return res.json({
        success: true,
        otp: booking.returnOTP,
      });
    }

    // Generate OTP

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    booking.returnOTP = otp;

    await booking.save();

    // Notification

    await Notification.create({
      user: booking.passenger,
      message: `🔑 Return OTP: ${otp}`,
    });

    res.json({
      success: true,
      otp,
      message: "Return OTP generated",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// ============================================
// VERIFY RETURN OTP
// ============================================

exports.verifyReturnOTP = async (req, res) => {

  try {

    const { otp } = req.body;

    const booking = await RentalBooking.findById(
      req.params.bookingId
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only Owner

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Already Completed

    if (booking.returnVerified) {
      return res.json({
        success: true,
        message: "Rental already completed",
      });
    }

    if (booking.returnOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Return OTP",
      });
    }

    booking.returnVerified = true;

    booking.bookingStatus = "COMPLETED";

await booking.save();

const vehicle = await RentalVehicle.findById(
    booking.vehicle
);

if (!vehicle) {
    return res.status(404).json({
        success: false,
        message: "Vehicle not found"
    });
}

vehicle.status = "UNAVAILABLE";

await vehicle.save();

console.log("Vehicle status updated:", vehicle.status);

    await Notification.create({

      user: booking.passenger,

      message:
        "🎉 Rental Completed Successfully. Thank you for using RideShare.",

    });

    res.json({

      success: true,

      message: "Rental Completed",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// ============================================
// PASSENGER CANCEL RENTAL BOOKING
// ============================================

exports.cancelRentalBooking = async (req, res) => {

    try {

        const { reason } = req.body;

        const booking = await RentalBooking.findById(
            req.params.bookingId
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Only passenger can cancel

        if (booking.passenger.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Only before pickup

        if (booking.bookingStatus !== "BOOKED") {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be cancelled now.",
            });
        }

        booking.bookingStatus = "CANCELLED";

        booking.cancelReason = reason || "No reason provided";

        await booking.save();

        // Make vehicle available again

        const vehicle = await RentalVehicle.findById(
            booking.vehicle
        );

        if (vehicle) {

            vehicle.status = "AVAILABLE";

            await vehicle.save();

        }

        // Notify owner

        await Notification.create({

            user: booking.owner,

            message: `❌ Booking cancelled by passenger.`

        });

        res.json({

            success: true,

            message: "Booking cancelled successfully."

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};