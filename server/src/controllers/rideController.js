const { validationResult } = require("express-validator");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Notification = require("../models/Notification");

const { giveRideCoins } = require("../services/rideCoinService");

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

  // try {
  //   const {
  //     origin,
  //     destination,
  //     date,
  //     seatsAvailable,
  //     pricePerSeat,
  //     vehicleType,
  //     vehicleName,
  //     vehicleNumber,
  //     fuelType,
  //   } = req.body;

  try {

  // ✅ CHECK ACTIVE RIDE
  const existingRide = await Ride.findOne({
    driver: req.user._id,
    status: { $in: ["OPEN", "ONGOING"] }
  });

  if (existingRide) {
    return res.status(400).json({
      success: false,
      message:
        "⚠️ You already have an active ride. Complete or cancel it before creating another ride."
    });
  }

  const {
    origin,
    destination,
    date,
    seatsAvailable,
    pricePerSeat,
    vehicleType,
    vehicleName,
    vehicleNumber,
    fuelType,
  } = req.body;

    const ride = await Ride.create({
      // driver: req.user.id,
      driver: req.user._id,
      origin,
      destination,
      date,
      seatsAvailable,
      pricePerSeat,
      status: "OPEN",
      vehicleType,
      vehicleName,
      vehicleNumber,
      fuelType,
    });
    // 🔔 CREATE NOTIFICATIONS FOR ALL PASSENGERS
const passengers = await User.find({ role: "passenger" });

const notifications = passengers.map((p) => ({
  user: p._id,
  message: `🚗 New ride available from ${origin} to ${destination}`,
}));

await Notification.insertMany(notifications);

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
// exports.getAvailableRides = async (req, res) => {
//   try {
//     const rides = await Ride.find({
//       status: "OPEN",
//       seatsAvailable: { $gt: 0 },
//     })
//       .populate("driver", "name phone email")
//       .sort({ date: 1 });

//     res.json(rides);
//   } catch (err) {
//     console.error("Get rides error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching rides",
//     });
//   }
// };
exports.getAvailableRides = async (req, res) => {
  try {
    const { femaleOnly } = req.query;
    const loggedInUser = req.user;

    let rides = await Ride.find({
      status: "OPEN",
      seatsAvailable: { $gt: 0 },
    })
      .populate("driver", "name phone email gender")
      .sort({ date: 1 });

    // Apply female-only filter ONLY for female passenger
    if (femaleOnly === "true" && loggedInUser.gender === "female") {
      rides = rides.filter(
        (ride) => ride.driver.gender === "female"
      );
    }

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
const alreadyReviewed = ride.reviews.find(
  r => r.passenger.toString() === req.user.id
);

if (alreadyReviewed) {
  return res.status(400).json({
    success: false,
    message: "You already reviewed this ride"
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

/* =====================================================
   START RIDE (DRIVER)
   PATCH /api/rides/:id/start
===================================================== */
exports.startRide = async (req, res) => {
  try {

    console.log("Driver ID:", req.user);   // debug

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found"
      });
    }

    // allow both id and _id from middleware
    const userId = req.user.id || req.user._id;

    if (ride.driver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (ride.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Ride already started or completed"
      });
    }

    ride.status = "ONGOING";

    await ride.save();

    res.json({
      success: true,
      message: "Ride started successfully"
    });

  } catch (err) {

    console.error("START RIDE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while starting ride"
    });

  }
};
/* =====================================================
   COMPLETE RIDE (DRIVER)
   PATCH /api/rides/:id/complete
===================================================== */
exports.completeRide = async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found"
      });
    }

    const userId = req.user.id || req.user._id;

    if (ride.driver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (ride.status !== "ONGOING") {
      return res.status(400).json({
        success: false,
        message: "Ride not started yet"
      });
    }

    // ride.status = "COMPLETED";

    // await ride.save();

    // res.json({
    //   success: true,
    //   message: "Ride completed successfully"
    // });
    ride.status = "COMPLETED";

await ride.save();

// Mark all bookings completed
await Booking.updateMany(
  { ride: ride._id },
  { status: "completed" }
);

// Fetch all bookings
const completedBookings = await Booking.find({
  ride: ride._id,
});

// Give RideCoins
for (const booking of completedBookings) {

  const rideAmount =
  ride.pricePerSeat * booking.seatsBooked;

await giveRideCoins({
  userId: booking.passenger,
  rideAmount,
  reason: "Ride Completed Reward",
});

}

res.json({
  success: true,
  message: "Ride completed successfully"
});

  } catch (err) {

    console.error("COMPLETE RIDE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while completing ride"
    });

  }
};

/* =====================================================
   PASSENGER RIDE DETAILS
   GET /api/rides/:id
===================================================== */
exports.getRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("driver", "name phone email") // 🔥 THIS LINE FIXES YOUR ISSUE
      .populate("passengers", "name phone");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.json({
      success: true,
      ride,
    });

  } catch (err) {
    console.error("Passenger ride details error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ride details",
    });
  }
};

/* =====================================================
   DRIVER STATS (NEW)
   GET /api/rides/driver/stats
===================================================== */
exports.getDriverStats = async (req, res) => {
  try {
    // get driver id safely
    const driverId = req.user.id || req.user._id;

    // fetch all rides of this driver
    const rides = await Ride.find({ driver: driverId });

    const total = rides.length;

    let cancelled = 0;
    let active = 0;

    rides.forEach((ride) => {
      // cancelled rides
      if (ride.status === "CANCELLED") cancelled++;

      // active rides (OPEN or ONGOING)
      if (ride.status === "OPEN" || ride.status === "ONGOING") {
        active++;
      }
    });

    res.json({
      total,
      cancelled,
      active,
    });

  } catch (err) {
    console.error("Driver stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver stats",
    });
  }
};

// exports.getActiveRide = async (req, res) => {
//   try {
//     const userId = req.user.id || req.user._id;

//     let ride = null;

//     if (req.user.role === "driver") {
//       ride = await Ride.findOne({
//         driver: userId,
//         status: { $in: ["OPEN", "ONGOING"] }
//       })
//       .populate("driver", "name phone")
//       .sort({ createdAt: -1 });
//     }

//     res.json({
//       success: true,
//       ride
//     });

//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch active ride"
//     });
//   }
// };

exports.getActiveRide = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    let ride = null;
    let bookingId = null;

    // DRIVER
    if (req.user.role === "driver") {

      ride = await Ride.findOne({
        driver: userId,
        status: { $in: ["OPEN", "ONGOING"] }
      })
      .populate("driver", "name phone")
      .sort({ createdAt: -1 });

    }

    // PASSENGER
    if (req.user.role === "passenger") {

      const booking = await Booking.findOne({
        passenger: userId,
        status: "confirmed"
      })
      .populate({
        path: "ride",
        match: {
          status: { $in: ["OPEN", "ONGOING"] }
        }
      })
      .sort({ createdAt: -1 });

      if (booking && booking.ride) {
        ride = booking.ride;
        bookingId = booking._id;
      }

    }

    res.json({
      success: true,
      ride,
      bookingId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active ride"
    });

  }
};