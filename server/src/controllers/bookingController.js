const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const User = require("../models/User");
const { giveRideCoins } = require("../services/rideCoinService");

/* =====================================================
   CREATE BOOKING AFTER PAYMENT
===================================================== */
exports.createBooking = async (req, res) => {
  try {
    // const { rideId, paymentId } = req.body;
    const { rideId, paymentId, seats, passengers } = req.body;

    const ride = await Ride.findById(rideId);
    const user = await User.findById(req.user.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // if (ride.seatsAvailable <= 0)
    //   return res.status(400).json({ message: "No seats available" });
    if (ride.seatsAvailable < (seats || 1)) {
  return res.status(400).json({ message: "Not enough seats available" });
}

    const existing = await Booking.findOne({
      ride: rideId,
      passenger: req.user.id,
    });

    if (existing)
      return res.status(400).json({ message: "Already booked this ride" });

    // const booking = await Booking.create({
    //   ride: rideId,
    //   passenger: req.user.id,
    //   driver: ride.driver,
    //   paymentId: paymentId || "DEMO_PAYMENT",
    //   status: "confirmed",
    //   paymentStatus: "paid",
    // });
    const booking = await Booking.create({
  ride: rideId,
  passenger: req.user.id,
  driver: ride.driver,

  // ✅ seats
  seatsBooked: seats || 1,

  // ✅ passenger list
  // passengers:
  //   passengers && passengers.length > 0
  //     ? passengers
  //     : [
  //         {
  //           name: req.user.name,
  //           phone: req.user.phone,
  //         },
  //       ],
  passengers:
  passengers && passengers.length > 0
    ? passengers
    : [
        {
          name: user.name,
          phone: user.phone,
        },
      ],

  paymentId: paymentId || "DEMO_PAYMENT",
  status: "confirmed",
  paymentStatus: "paid",
});

    ride.passengers.push(req.user.id);
    // ride.seatsAvailable -= 1;
    // ride.seatsAvailable -= (seats || 1);
    // if (ride.seatsAvailable === 0) ride.status = "BOOKED";
    // await ride.save();
    ride.seatsAvailable -= (seats || 1);

if (ride.seatsAvailable < 0) {
  ride.seatsAvailable = 0;
}

await ride.save();

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};


/* =====================================================
   PASSENGER – MY BOOKINGS
===================================================== */
// exports.getPassengerBookings = async (req, res) => {
//   const bookings = await Booking.find({ passenger: req.user.id })
//     .populate({
//       path: "ride",
//       populate: { path: "driver", select: "name phone" },
//     })
//     .sort({ createdAt: -1 });

//   res.json(bookings);
// };
// exports.getPassengerBookings = async (req, res) => {
//   const bookings = await Booking.find({ passenger: req.user.id })
//     .populate({
//       path: "ride",
//       populate: { path: "driver", select: "name phone" },
//       options: { strictPopulate: false }
//     })
//     .sort({ createdAt: -1 });

//   res.json(bookings);
// };

// exports.getPassengerBookings = async (req, res) => {
//   try {

//     const bookings = await Booking.find({ passenger: req.user.id })
//       .populate({
//         path: "ride",
//         populate: [
//           {
//             path: "driver",
//             select: "name phone"
//           },
//           {
//             path: "reviews.passenger",
//             select: "_id name"
//           }
//         ]
//       })
//       .sort({ createdAt: -1 });

//     res.json(bookings);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };
// exports.getPassengerBookings = async (req, res) => {
//   try {

//     const bookings = await Booking.find({ passenger: req.user.id })
//       .populate({
//         path: "ride",
//         populate: [
//           {
//             path: "driver",
//             select: "name phone"
//           }
//         ]
//       })
//       .sort({ createdAt: -1 });

//     res.json(bookings);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };
// exports.getPassengerBookings = async (req, res) => {
//   try {

//     const bookings = await Booking.find({ passenger: req.user.id })
//       .populate({
//         path: "ride",
//         populate: [
//           {
//             path: "driver",
//             select: "name phone"
//           }
//         ]
//       })
//       .lean() // VERY IMPORTANT
//       .sort({ createdAt: -1 });

//     res.json(bookings);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };
exports.getPassengerBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({ passenger: req.user.id })
      // .populate({
      //   path: "ride",
      //   select: "origin destination date seatsAvailable status vehicleType vehicleName vehicleNumber fuelType driver",
      //   populate: {
      //     path: "driver",
      //     select: "name phone"
      //   }
      // })
      .populate({
  path: "ride",
  select: "origin destination date seatsAvailable status vehicleType vehicleName vehicleNumber fuelType driver reviews",
  populate: [
    {
      path: "driver",
      select: "name phone"
    },
    {
      path: "reviews.passenger",
      select: "_id name"
    }
  ]
})
      .lean()
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/* =====================================================
   DRIVER – MY RIDES
===================================================== */
// exports.getDriverRides = async (req, res) => {
//   const rides = await Ride.find({ driver: req.user.id })
//     .populate("passengers", "name phone")
//     .sort({ date: -1 });

//   res.json(rides);
// };
exports.getDriverRideDetails = async (req, res) => {
  try {
    // 1️⃣ get ride
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // 2️⃣ get bookings for this ride
    const bookings = await Booking.find({ ride: ride._id })
      .populate("passenger", "name phone")
      .lean();   // ✅ IMPORTANT

    // 3️⃣ send both
    res.json({
      ride,
      bookings,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ride details" });
  }
};


/* =====================================================
   PASSENGER – SINGLE BOOKING DETAILS
   GET /api/bookings/:id
===================================================== */
exports.getBookingById = async (req, res) => {
  // const booking = await Booking.findById(req.params.id)
  //   .populate({
  //     path: "ride",
  //     populate: { path: "driver", select: "name phone" },
  //   });
  const booking = await Booking.findById(req.params.id)
  .populate({
    path: "ride",
    // select: "origin destination date seatsAvailable status vehicleType vehicleName fuelType driver",
    select: "origin destination date seatsAvailable status vehicleType vehicleName vehicleNumber fuelType driver",
    populate: {
      path: "driver",
      select: "name phone"
    }
  });

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.passenger.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json(booking);
};




/* =====================================================
   START RIDE (Driver)
===================================================== */
exports.startRide = async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.id);

    if (!ride)
      return res.status(404).json({ message: "Ride not found" });

    if (ride.driver.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    ride.status = "ONGOING";

    await ride.save();

    res.json({
      success: true,
      message: "Ride started"
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to start ride" });
  }
};

/* =====================================================
   MARK RIDE COMPLETED (Driver)
===================================================== */
exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.driver.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    ride.status = "COMPLETED";
    await ride.save();

    await Booking.updateMany(
      { ride: ride._id },
      { status: "completed" }
    );
// --------------------------------------**************************************
    // Get all completed bookings for this ride
const completedBookings = await Booking.find({
  ride: ride._id,
});

// Reward RideCoins to every passenger
for (const booking of completedBookings) {

  // Calculate total ride amount
  const rideAmount =
    ride.pricePerSeat * booking.seatsBooked;

  // Calculate RideCoins
  const coins = Math.floor(rideAmount * 0.05);

  // Skip if reward is 0
  if (coins <= 0) continue;

  // Give RideCoins
  await giveRideCoins({
    userId: booking.passenger,
    coins,
    reason: "Ride Completed Reward",
  });

}
// /-----------------------***************************************************

    res.json({ success: true, message: "Ride marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to complete ride" });
  }
};

/* =====================================================
   PASSENGER CANCEL BOOKING
===================================================== */
exports.cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.passenger.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const ride = await Ride.findById(booking.ride);

    if (!ride)
      return res.status(404).json({ message: "Ride not found" });

    // ❗ Prevent cancel after ride started
    if (ride.status === "ONGOING" || ride.status === "COMPLETED") {
      return res.status(400).json({
        message: "Ride already started or completed. Cannot cancel."
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Ride already cancelled"
      });
    }

    // cancel booking
    // booking.status = "cancelled";
    const { reason } = req.body;

booking.status = "cancelled";
booking.cancelReason = reason || "";
    await booking.save();

    // increase seat again
    // ride.seatsAvailable += 1;
    // ride.seatsAvailable += booking.seatsBooked || 1;

    // remove passenger from ride
    // ride.passengers = ride.passengers.filter(
    //   p => p.toString() !== req.user.id
    // );

    // await ride.save();
    ride.seatsAvailable += booking.seatsBooked || 1;

ride.passengers = ride.passengers.filter(
  p => p.toString() !== req.user.id
);

// check remaining confirmed bookings
const activeBookings = await Booking.countDocuments({
  ride: ride._id,
  status: "confirmed"
});

if (activeBookings === 0) {
  ride.status = "CANCELLED";
}

await ride.save();

    res.json({
      success: true,
      message: "Ride cancelled successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancel failed" });
  }
};

/* =====================================================
   PASSENGER STATS (NEW)
   GET /api/bookings/passenger/stats
===================================================== */
exports.getPassengerStats = async (req, res) => {
  try {
    const passengerId = req.user.id;

    // get all bookings with ride info
    const bookings = await Booking.find({ passenger: passengerId })
      .populate("ride");

    const total = bookings.length;

    let cancelled = 0;
    let upcoming = 0;

    bookings.forEach((b) => {
      // cancelled bookings
      if (b.status === "cancelled") cancelled++;

      // upcoming bookings
      // if (
      //   b.status === "confirmed" &&
      //   b.ride &&
      //   new Date(b.ride.date) >= new Date()
      // ) {
      //   upcoming++;
      // }
      if (
  b.status === "confirmed" &&
  b.ride &&
  (
    b.ride.status === "OPEN" ||
    b.ride.status === "ONGOING"
  )
) {
  upcoming++;
}
    });

    res.json({
      total,
      cancelled,
      upcoming,
    });

  } catch (err) {
    console.error("Passenger stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch passenger stats",
    });
  }
};