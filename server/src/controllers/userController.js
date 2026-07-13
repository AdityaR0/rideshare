const User = require("../models/User");

// GET /api/users/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.profileImage) {
  user.profileImage = req.body.profileImage;
}

    // common
    // user.gender = req.body.gender;
    // user.workingAt = req.body.workingAt;
    // user.address = req.body.address;
    // user.aadharNumber = req.body.aadharNumber;
    user.gender = req.body.gender || user.gender;

user.workingAt =
  req.body.workingAt || user.workingAt;

user.address =
  req.body.address || user.address;

user.aadharNumber =
  req.body.aadharNumber || user.aadharNumber;

    // driver only
    if (user.role === "driver") {
      user.drivingLicense = req.body.drivingLicense || user.drivingLicense;

      // ADD VEHICLE ANYTIME
      if (req.body.vehicleName && req.body.vehicleNumber) {
        user.vehicles.push({
          vehicleType: req.body.vehicleType,
          vehicleName: req.body.vehicleName,
          vehicleNumber: req.body.vehicleNumber,
          // fuelType: req.body.fuelType, 
          fuelType: req.body.fuelType || "petrol",
        });
      }
    }

    user.isProfileComplete = true;
    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
};
