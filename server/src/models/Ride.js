const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const sosSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: 'SOS triggered during ride' },
  },
  { timestamps: true }
);

const rideSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    seatsAvailable: { type: Number, required: true, min: 0 },
    pricePerSeat: { type: Number, required: true, min: 0 },
    vehicleType: {
  type: String,
},

vehicleName: {
  type: String,
},
vehicleNumber: {
  type: String,
},
fuelType: {
  type: String,
},
    // status: {
    //   type: String,
    //   enum: ['OPEN', 'BOOKED', 'COMPLETED', 'CANCELLED'],
    //   default: 'OPEN',
    status: {
  type: String,
  enum: ['OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED'],
  default: 'OPEN',
    },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reviews: [reviewSchema],
    sosEvents: [sosSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
