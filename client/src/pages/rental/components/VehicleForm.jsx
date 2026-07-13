// import { useState } from "react";
import { useEffect, useState } from "react";
// import { createRentalVehicle } from "../../../services/rentalService";
import {
  createRentalVehicle,
  updateRentalVehicle,
} from "../../../services/rentalService";

// export default function VehicleForm() {
export default function VehicleForm({
  editingVehicle,
  setEditingVehicle,
  refreshVehicles,
  selectedVehicle,
}) {
  const [loading, setLoading] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleName: "",
    vehicleNumber: "",
    fuelType: "",
    transmission: "",
    modelYear: "",

    pricePerDay: "",
    securityDeposit: "",
    minimumRentalDays: "",

    pickupAddress: "",
    description: "",

    images: [],
  });

  useEffect(() => {
  if (!selectedVehicle) return;

  setFormData((prev) => ({
    ...prev,

    vehicleType:
      selectedVehicle.type?.charAt(0).toUpperCase() +
        selectedVehicle.type?.slice(1) || "",

    vehicleName: selectedVehicle.name || "",

    vehicleNumber: selectedVehicle.number || "",

    fuelType: selectedVehicle.fuelType || "",

    transmission: selectedVehicle.transmission || "",

    modelYear: selectedVehicle.modelYear || "",
  }));
}, [selectedVehicle]);


useEffect(() => {
  if (!editingVehicle) return;

  setEditingVehicleId(editingVehicle._id);

  setFormData({
    vehicleType: editingVehicle.vehicleType || "",
    vehicleName: editingVehicle.vehicleName || "",
    vehicleNumber: editingVehicle.vehicleNumber || "",
    fuelType: editingVehicle.fuelType || "",
    transmission: editingVehicle.transmission || "",
    modelYear: editingVehicle.modelYear || "",

    pricePerDay: editingVehicle.pricePerDay || "",
    securityDeposit: editingVehicle.securityDeposit || "",
    minimumRentalDays:
      editingVehicle.minimumRentalDays || "",

    pickupAddress: editingVehicle.pickupAddress || "",
    description: editingVehicle.description || "",

    images: editingVehicle.images || [],
  });
  if (
  editingVehicle.images &&
  editingVehicle.images.length > 0
) {
  setPreview(editingVehicle.images[0]);
}

}, [editingVehicle]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setSelectedImage(file);

  setPreview(URL.createObjectURL(file));

};

const resetForm = () => {
  setEditingVehicleId(null);

  setEditingVehicle(null);

  setFormData({
    vehicleType: "",
    vehicleName: "",
    vehicleNumber: "",
    fuelType: "",
    transmission: "",
    modelYear: "",

    pricePerDay: "",
    securityDeposit: "",
    minimumRentalDays: "",

    pickupAddress: "",
    description: "",

    images: [],
  });
  setSelectedImage(null);

setPreview("");
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

data.append("vehicleType", formData.vehicleType);
data.append("vehicleName", formData.vehicleName);
data.append("vehicleNumber", formData.vehicleNumber);
data.append("fuelType", formData.fuelType);
data.append("transmission", formData.transmission);
data.append("modelYear", formData.modelYear);

data.append("pricePerDay", formData.pricePerDay);
data.append(
  "securityDeposit",
  formData.securityDeposit
);

data.append(
  "minimumRentalDays",
  formData.minimumRentalDays
);

data.append(
  "pickupAddress",
  formData.pickupAddress
);

data.append(
  "description",
  formData.description
);

// Upload image
if (selectedImage) {
  data.append("image", selectedImage);
}

let response;

if (editingVehicleId) {

  response = await updateRentalVehicle(
    editingVehicleId,
    data
  );

} else {

  response = await createRentalVehicle(
    data
  );

}

      alert(response.message);
      refreshVehicles();

// setEditingVehicle(null);

// setEditingVehicleId(null);

//       setFormData({
//         vehicleType: "",
//         vehicleName: "",
//         vehicleNumber: "",
//         fuelType: "",
//         transmission: "",
//         modelYear: "",

//         pricePerDay: "",
//         securityDeposit: "",
//         minimumRentalDays: "",

//         pickupAddress: "",
//         description: "",

//         images: [],
//       });
resetForm();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to publish vehicle"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow border border-gray-200 p-5"
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
          🚗
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Add New Vehicle
          </h2>

          <p className="text-xs text-gray-500">
            Fill all vehicle details carefully.
          </p>
        </div>

      </div>

      <hr className="mb-4" />

      {/* ================= VEHICLE DETAILS ================= */}

      <h3 className="text-sm font-semibold mb-3 text-gray-800">
        Vehicle Details
      </h3>

      <div className="grid md:grid-cols-3 gap-3">

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Vehicle Type
          </label>

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Select Type</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
            <option value="Scooter">Scooter</option>
            <option value="Cycle">Cycle</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Brand / Model
          </label>

          <input
            type="text"
            name="vehicleName"
            value={formData.vehicleName}
            onChange={handleChange}
            placeholder="Honda City"
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Vehicle Number
          </label>

          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="WB 01 AB 1234"
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
          />
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-4">

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Fuel Type
          </label>

          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Select Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Transmission
          </label>

          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Select</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Model Year
          </label>

          <input
            type="number"
            name="modelYear"
            value={formData.modelYear}
            onChange={handleChange}
            placeholder="2024"
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
          />
        </div>

      </div>

            {/* ================= RENTAL DETAILS ================= */}

      <h3 className="text-sm font-semibold mt-5 mb-3 text-gray-800">
        Rental Details
      </h3>

      <div className="grid md:grid-cols-3 gap-3">

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Price Per Day (₹)
          </label>

          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            placeholder="1200"
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Security Deposit (₹)
          </label>

          <input
            type="number"
            name="securityDeposit"
            value={formData.securityDeposit}
            onChange={handleChange}
            placeholder="5000"
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">
            Minimum Rental Days
          </label>

          <input
            type="number"
            name="minimumRentalDays"
            value={formData.minimumRentalDays}
            onChange={handleChange}
            placeholder="1"
            className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
          />
        </div>

      </div>

      {/* ================= PICKUP LOCATION ================= */}

      <div className="mt-4">

        <label className="text-xs font-semibold text-gray-700">
          Pickup Location
        </label>

        <input
          type="text"
          name="pickupAddress"
          value={formData.pickupAddress}
          onChange={handleChange}
          placeholder="Enter pickup location"
          className="w-full h-10 mt-1 px-3 border rounded-lg text-sm"
        />

      </div>

      {/* ================= DESCRIPTION ================= */}

      {/* <div className="mt-4">

        <label className="text-xs font-semibold text-gray-700">
          Vehicle Description
        </label>

        <textarea
          rows={2}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your vehicle..."
          className="w-full h-20 mt-1 p-3 border rounded-lg text-sm resize-none"
        />

      </div> */}

      {/* ================= IMAGES ================= */}

      <div className="mt-4">

        <label className="text-xs font-semibold text-gray-700">
          Vehicle Images
        </label>

        <div className="flex gap-3 mt-2">

          <label
  className="
  w-28
  h-20
  border-2
  border-dashed
  rounded-lg
  flex
  flex-col
  items-center
  justify-center
  cursor-pointer
  hover:bg-gray-50"
>

  <input
    type="file"
    hidden
    accept="image/*"
    onChange={handleImageChange}
  />

  <div className="text-xl">
    📷
  </div>

  <div className="text-[11px] text-gray-500">
    Upload
  </div>

</label>

          <div className="flex-1 border rounded-lg h-20 overflow-hidden flex items-center justify-center">

  {preview ? (

    <img
      src={preview}
      alt="Preview"
      className="w-full h-full object-cover"
    />

  ) : (

    <span className="text-xs text-gray-400">

      Uploaded image will appear here

    </span>

  )}

</div>

        </div>

      </div>

      {/* ================= BUTTONS ================= */}

      <div className="flex justify-end gap-2 mt-5">

        {/* <button
          type="button"
          className="px-5 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm"
        >
          Cancel
        </button> */}
        <button
  type="button"
  onClick={resetForm}
  className="px-5 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm"
>
  Cancel
</button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 h-9 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium"
        >
          {/* {loading ? "Publishing..." : "Publish Vehicle"} */}
          {loading
  ? editingVehicleId
    ? "Updating..."
    : "Publishing..."
  : editingVehicleId
  ? "Update Vehicle"
  : "Publish Vehicle"}
        </button>

      </div>

    </form>
  );
}