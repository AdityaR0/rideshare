// server/src/routes/sosRoutes.js
const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/sos/trigger
router.post("/trigger", protect, async (req, res) => {
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

// No active ride
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

const driverName = rideDetails.driver.name;

const vehicleName = rideDetails.vehicleName;

const vehicleNumber = rideDetails.vehicleNumber;

const origin = rideDetails.origin;

const destination = rideDetails.destination;

  const pythonFile = path.join(__dirname, "../../../alert/alert.py");
  console.log("Running Python SOS script:", pythonFile);

exec(
  `python "${pythonFile}" "${passengerName}" "${driverName}" "${vehicleName}" "${vehicleNumber}" "${origin}" "${destination}"`,
  (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    // If Python script fails but stdout contains success, treat it as success
    if (error && !stdout.includes("✅ SOS SMS sent")) {
      console.error("SOS ERROR:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, message: "✅ SOS alert sent!", output: stdout });
  });
});

module.exports = router;
