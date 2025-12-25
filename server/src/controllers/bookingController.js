const Booking = require("../models/Booking");
const Ride = require("../models/Ride");

/* =====================================================
   CREATE BOOKING AFTER PAYMENT
===================================================== */
exports.createBooking = async (req, res) => {
  try {
    const { rideId, paymentId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.seatsAvailable <= 0)
      return res.status(400).json({ message: "No seats available" });

    const existing = await Booking.findOne({
      ride: rideId,
      passenger: req.user.id,
    });

    if (existing)
      return res.status(400).json({ message: "Already booked this ride" });

    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user.id,
      driver: ride.driver,
      paymentId: paymentId || "DEMO_PAYMENT",
      status: "confirmed",
      paymentStatus: "paid",
    });

    ride.passengers.push(req.user.id);
    ride.seatsAvailable -= 1;
    if (ride.seatsAvailable === 0) ride.status = "BOOKED";
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
exports.getPassengerBookings = async (req, res) => {
  const bookings = await Booking.find({ passenger: req.user.id })
    .populate({
      path: "ride",
      populate: { path: "driver", select: "name phone" },
    })
    .sort({ createdAt: -1 });

  res.json(bookings);
};


/* =====================================================
   DRIVER – MY RIDES
===================================================== */
exports.getDriverRides = async (req, res) => {
  const rides = await Ride.find({ driver: req.user.id })
    .populate("passengers", "name phone")
    .sort({ date: -1 });

  res.json(rides);
};


/* =====================================================
   PASSENGER – SINGLE BOOKING DETAILS
   GET /api/bookings/:id
===================================================== */
exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: "ride",
      populate: { path: "driver", select: "name phone" },
    });

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.passenger.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json(booking);
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

    res.json({ success: true, message: "Ride marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to complete ride" });
  }
};
