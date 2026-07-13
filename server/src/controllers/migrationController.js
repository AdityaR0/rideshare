const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

exports.migrateVehicles = async (req, res) => {
  try {

    const users = await User.find();

    let total = 0;

    for (const user of users) {

      if (!user.vehicles || user.vehicles.length === 0)
        continue;

      for (const v of user.vehicles) {

        const alreadyExists = await Vehicle.findOne({
          driver: user._id,
          number: v.vehicleNumber,
        });

        if (alreadyExists) continue;

        await Vehicle.create({

          driver: user._id,

          type: v.vehicleType.toLowerCase(),

          name: v.vehicleName,

          number: v.vehicleNumber,

          fuelType: v.fuelType || "petrol",

        });

        total++;

      }

    }

    res.json({
      success: true,
      message: `${total} vehicles migrated successfully.`,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Migration failed",
    });

  }
};