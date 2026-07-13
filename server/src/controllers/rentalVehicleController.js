const RentalVehicle = require("../models/RentalVehicle");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// =======================================================
// CREATE RENTAL VEHICLE
// =======================================================

exports.createRentalVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      vehicleName,
      vehicleNumber,
      fuelType,
      transmission,
      pricePerDay,
      securityDeposit,
      pickupAddress,
      description,
    } = req.body;
    let uploadedImages = [];

    // Required Fields Validation
    if (
      !vehicleType ||
      !vehicleName ||
      !vehicleNumber ||
      !fuelType ||
      !pricePerDay ||
      !pickupAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check duplicate vehicle
    const existingVehicle = await RentalVehicle.findOne({
      vehicleNumber,
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle already listed for rent",
      });
    }

    let imageUrls = [];

if (req.file) {

  const uploadFromBuffer = () => {
    return new Promise((resolve, reject) => {

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rideshare-rentals",
        },
        (error, result) => {

          if (error) return reject(error);

          resolve(result);

        }
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(uploadStream);

    });
  };

  const uploadedImage = await uploadFromBuffer();

  imageUrls.push(uploadedImage.secure_url);

}

// Upload image to Cloudinary

if (req.file) {

  const result = await new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "RideShareRentalVehicles",
      },
      (error, result) => {

        if (error) return reject(error);

        resolve(result);

      }
    );

    streamifier
      .createReadStream(req.file.buffer)
      .pipe(stream);

  });

  uploadedImages.push(result.secure_url);

}

    // Create Rental Vehicle
    const rentalVehicle = await RentalVehicle.create({
      owner: req.user.id,

      vehicleType,
      vehicleName,
      vehicleNumber,
      fuelType,

      transmission,

      pricePerDay,

      securityDeposit: securityDeposit || 0,

      pickupAddress,

      description: description || "",

      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle listed successfully",
      rentalVehicle,
    });

  } catch (err) {
    console.error("Create Rental Vehicle Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================================
// GET MY RENTAL VEHICLES
// =======================================================

exports.getMyRentalVehicles = async (req, res) => {
  try {

    const rentalVehicles = await RentalVehicle.find({
      owner: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      rentalVehicles,
    });

  } catch (err) {

    console.error("Get Rental Vehicles Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// =======================================================
// DELETE RENTAL VEHICLE
// =======================================================

exports.deleteRentalVehicle = async (req, res) => {
  try {

    const vehicle = await RentalVehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check ownership
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await RentalVehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });

  } catch (err) {

    console.error("Delete Rental Vehicle Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// =======================================================
// UPDATE RENTAL VEHICLE
// =======================================================

exports.updateRentalVehicle = async (req, res) => {
  try {

    const vehicle = await RentalVehicle.findById(req.params.id);
    let uploadedImages = vehicle.images;

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check Owner

    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

// Upload new image if selected

if (req.file) {

  const result = await new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "RideShareRentalVehicles",
      },
      (error, result) => {

        if (error) return reject(error);

        resolve(result);

      }
    );

    streamifier
      .createReadStream(req.file.buffer)
      .pipe(stream);

  });

  uploadedImages = [result.secure_url];

}

    const updatedVehicle = await RentalVehicle.findByIdAndUpdate(

  req.params.id,

  {

    ...req.body,

    images: uploadedImages,

  },

  {

    new: true,

    runValidators: true,

  }

);

    res.status(200).json({

      success: true,

      message: "Vehicle updated successfully",

      rentalVehicle: updatedVehicle,

    });

  } catch (err) {

    console.error("Update Rental Vehicle Error:", err);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }
};

// =======================================================
// GET ALL RENTAL VEHICLES (Passenger)
// =======================================================

exports.getAllRentalVehicles = async (req, res) => {
  try {

    const rentalVehicles = await RentalVehicle.find({
    status: "AVAILABLE",
})
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rentalVehicles,
    });

  } catch (err) {

    console.error("Get All Rental Vehicles Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// =======================================================
// GET SINGLE RENTAL VEHICLE
// =======================================================

exports.getRentalVehicleById = async (req, res) => {
  try {

    const rentalVehicle = await RentalVehicle.findById(req.params.id)
      .populate("owner", "name phone email");

    if (!rentalVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      rentalVehicle,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

exports.toggleVehicleStatus = async (req, res) => {
  try {
    const vehicle = await RentalVehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Don't allow changing booked vehicle
    if (vehicle.status === "BOOKED") {
      return res.status(400).json({
        success: false,
        message: "Vehicle is currently booked",
      });
    }

    vehicle.status =
      vehicle.status === "AVAILABLE"
        ? "UNAVAILABLE"
        : "AVAILABLE";

    await vehicle.save();

    res.json({
      success: true,
      rentalVehicle: vehicle,
      message: "Vehicle status updated successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};