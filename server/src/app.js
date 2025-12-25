const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sosRoutes = require("./routes/sosRoutes");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const rideRoutes = require("./routes/rideRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

/* ================= RATE LIMIT (AUTH ONLY) ================= */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

/* ================= ROUTES ================= */

// Auth
app.use("/api/auth", authLimiter, authRoutes);

// Core modules
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/community", require("./routes/communityRoutes"));

// Payments (Stripe + Cash)
app.use("/api/payments", paymentRoutes);

// 🚗 MAIN CARPOOL FLOW
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).send("✅ Carpool API is running");
});

module.exports = app;
