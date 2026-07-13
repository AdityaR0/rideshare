const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

// ===============================
// COMPLETE DRIVER PROFILE (ONBOARDING)
// ===============================
exports.completeDriverProfile = async (req, res) => {
  try {
    const { gender, workingAt, address, aadharNumber, vehicles } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      gender,
      workingAt,
      address,
      aadharNumber,
      isProfileComplete: true,
    });

    if (vehicles && vehicles.length > 0) {
      await Vehicle.deleteMany({ driver: req.user.id });

      const vehicleDocs = vehicles.map((v) => ({
        driver: req.user.id,
        type: v.vehicleType,
        name: v.vehicleName,
        number: v.vehicleNumber,
      }));

      await Vehicle.insertMany(vehicleDocs);

      // sync first vehicle to user (for dashboard)
      await User.findByIdAndUpdate(req.user.id, {
        vehicles: vehicles,
      });
    }

    res.json({ message: "Driver profile completed" });
  } catch (err) {
    res.status(500).json({ message: "Driver profile failed" });
  }
};

// ===============================
// DRIVER PERSONAL UPDATE
// ===============================
exports.updateDriverProfile = async (req, res) => {
  try {
    const { workingAt, address } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      workingAt,
      address,
    });

    res.json({ message: "Driver personal profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Driver personal update failed" });
  }
};

// ===============================
// DRIVER VEHICLE UPDATE (FINAL FIX)
// ===============================
exports.addOrUpdateVehicle = async (req, res) => {
  try {
    const { type, name, number, color } = req.body;

    // 1️⃣ Save vehicle in Vehicle collection
    const vehicle = await Vehicle.findOneAndUpdate(
      { driver: req.user.id },
      {
        driver: req.user.id,
        type,
        name,
        number,
        color,
      },
      { new: true, upsert: true }
    );

    // 2️⃣ Sync vehicle into User.vehicles (IMPORTANT for dashboard)
    await User.findByIdAndUpdate(req.user.id, {
      vehicles: [
        {
          vehicleType: type,
          vehicleName: name,
          vehicleNumber: number,
        },
      ],
    });

    res.json({
      message: "Vehicle saved successfully",
      vehicle,
    });
  } catch (err) {
    res.status(500).json({ message: "Vehicle update failed" });
  }
};

// ======================================================
// GET MY REGISTERED VEHICLES
// ======================================================

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      driver: req.user.id,
    });

    res.status(200).json({
      success: true,
      vehicles,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};