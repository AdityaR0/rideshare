const express = require("express");
const twilio = require("twilio");

const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const EMERGENCY_CONTACT = "+919608554339";

// POST /api/sos/trigger
router.post("/trigger", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let ride = null;

    // DRIVER
    if (role === "driver") {
      ride = await Ride.findOne({
        driver: userId,
        status: { $in: ["OPEN", "ONGOING"] },
      }).sort({ createdAt: -1 });
    }

    // PASSENGER
    if (role === "passenger") {
      const booking = await Booking.findOne({
        passenger: userId,
        status: "confirmed",
      })
        .populate({
          path: "ride",
          match: {
            status: { $in: ["OPEN", "ONGOING"] },
          },
        })
        .sort({ createdAt: -1 });

      if (booking && booking.ride) {
        ride = booking.ride;
      }
    }

    if (!ride) {
      return res.status(400).json({
        success: false,
        message: "No active ride found.",
      });
    }

    const rideDetails = await Ride.findById(ride._id)
      .populate("driver", "name phone")
      .populate("passengers", "name");

    const passengerName =
      role === "passenger"
        ? req.user.name
        : rideDetails.passengers.length > 0
        ? rideDetails.passengers[0].name
        : "Passenger";

    const driverName = rideDetails.driver?.name || "Unknown Driver";
    const vehicleName = rideDetails.vehicleName || "Vehicle";
    const vehicleNumber = rideDetails.vehicleNumber || "Unknown";
    const origin = rideDetails.origin || "Unknown";
    const destination = rideDetails.destination || "Unknown";

    // ---------------- SMS ----------------
// ---------------- SHORT SMS (Twilio Trial Friendly) ----------------
const smsBody =
  `SOS!\n` +
  `${passengerName}\n` +
  `${vehicleNumber}\n` +
  `${origin} -> ${destination}`;

    await client.messages.create({
      body: smsBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: EMERGENCY_CONTACT,
    });

    // ---------------- Voice Call ----------------
    const voice = `
<Response>
<Say voice="alice">
Emergency Alert.

Passenger ${passengerName}
has pressed the RideShare emergency button.

Driver is ${driverName}.

Vehicle number ${vehicleNumber}.

The ride is from ${origin}
to ${destination}.

Please provide immediate assistance.
</Say>
</Response>`;

    await client.calls.create({
      twiml: voice,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: EMERGENCY_CONTACT,
    });

    return res.json({
      success: true,
      message: "SOS alert sent successfully.",
    });
  } catch (err) {
    console.error("SOS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
