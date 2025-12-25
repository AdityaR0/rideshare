const { validationResult } = require("express-validator");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");

/* =====================================================
   CREATE RIDE (DRIVER)
   POST /api/rides
===================================================== */
exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const {
      origin,
      destination,
      date,
      seatsAvailable,
      pricePerSeat,
    } = req.body;

    const ride = await Ride.create({
      driver: req.user.id,
      origin,
      destination,
      date,
      seatsAvailable,
      pricePerSeat,
      status: "OPEN",
    });

    res.status(201).json({
      success: true,
      message: "Ride created successfully",
      ride,
    });
  } catch (err) {
    console.error("Create ride error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating ride",
    });
  }
};


/* =====================================================
   GET AVAILABLE RIDES (PASSENGER)
   GET /api/rides
===================================================== */
exports.getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "OPEN",
      seatsAvailable: { $gt: 0 },
    })
      .populate("driver", "name phone email")
      .sort({ date: 1 });

    res.json(rides);
  } catch (err) {
    console.error("Get rides error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching rides",
    });
  }
};


/* =====================================================
   DRIVER DASHBOARD – MY RIDES
   GET /api/rides/driver/my
===================================================== */
exports.getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user.id })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    console.error("Driver rides error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching driver rides",
    });
  }
};


/* =====================================================
   DRIVER RIDE DETAILS (🔥 MOST IMPORTANT)
   GET /api/rides/driver/:id/details
===================================================== */
exports.getDriverRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("driver", "name phone")
      .populate("passengers", "name phone");

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // security
    if (ride.driver._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ ride: ride._id })
      .populate("passenger", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      ride,
      bookings,
    });
  } catch (err) {
    console.error("Ride details error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ride details",
    });
  }
};


/* =====================================================
   SEND SOS
   POST /api/rides/:rideId/sos
===================================================== */
exports.sendSOS = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    ride.sosEvents.push({
      user: req.user.id,
      message: "SOS triggered during ride",
      createdAt: new Date(),
    });

    await ride.save();

    res.json({
      success: true,
      message: "SOS alert recorded successfully",
    });
  } catch (err) {
    console.error("SOS error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while sending SOS",
    });
  }
};


/* =====================================================
   ADD REVIEW
   POST /api/rides/:rideId/review
===================================================== */
exports.addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { rating, comment } = req.body;

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    ride.reviews.push({
      passenger: req.user.id,
      rating,
      comment: comment || "",
      createdAt: new Date(),
    });

    await ride.save();

    res.json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding review",
    });
  }
};
