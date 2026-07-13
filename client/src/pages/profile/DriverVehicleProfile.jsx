import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function DriverVehicleProfile() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleType: "car",
    vehicleName: "",
    vehicleNumber: "",
    fuelType: "petrol", //
  });

  const addVehicle = async (e) => {
    e.preventDefault();

    // await api.put("/users/me", {
    //   vehicles: [...(user.vehicles || []), vehicle],
    // });
    await api.put("/users/me", {
  vehicleType: vehicle.vehicleType,
  vehicleName: vehicle.vehicleName,
  vehicleNumber: vehicle.vehicleNumber,
  fuelType: vehicle.fuelType,
});

    await refreshProfile();
    alert("Vehicle added");

    // setVehicle({ vehicleType: "car", vehicleName: "", vehicleNumber: "" });
    setVehicle({
  vehicleType: "car",
  vehicleName: "",
  vehicleNumber: "",
  fuelType: "petrol", // ✅ ADD
});
  };

  return (
    <div className="bg-slate-50 py-10">
      {/* <div className="max-w-lg mx-auto px-4"> */}
      {/* <div className="max-w-3xl mx-auto px-4"> */}
      <div className="max-w-2xl mx-auto px-4">
        <form
          onSubmit={addVehicle}
          // className="bg-white rounded-2xl shadow-sm p-6 space-y-5"
          className="
bg-white
rounded-3xl
shadow-xl
border
border-slate-200
p-8
space-y-6
"
        >
          {/* <h2 className="text-xl font-semibold text-slate-900">
            Vehicle Details
          </h2> */}
          <div>

  <button
    type="button"
    onClick={() => navigate(-1)}
    className="
      text-sm
      font-medium
      text-indigo-600
      hover:text-indigo-700
    "
  >
    ← Back
  </button>

  {/* <h2 className="text-3xl font-bold text-slate-900 mt-4"> */}
  <h2 className="text-2xl font-bold text-slate-900 mt-4">
    Add New Vehicle
  </h2>

  <p className="text-slate-500 mt-1">
    Register a vehicle to offer rides on RideShare.
  </p>

</div>
<div className="grid md:grid-cols-2 gap-5">

  {/* VEHICLE TYPE */}
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      Vehicle Type
    </label>

    <select
      value={vehicle.vehicleType}
      onChange={(e) =>
        setVehicle({ ...vehicle, vehicleType: e.target.value })
      }
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
    >
      <option value="car">Car</option>
      <option value="bike">Bike</option>
    </select>
  </div>

  {/* VEHICLE NAME */}
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      Vehicle Name
    </label>

    <input
      value={vehicle.vehicleName}
      onChange={(e) =>
        setVehicle({ ...vehicle, vehicleName: e.target.value })
      }
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
    />
  </div>

  {/* VEHICLE NUMBER */}
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      Vehicle Number
    </label>

    <input
      placeholder="WB20AB1234"
      value={vehicle.vehicleNumber}
      onChange={(e) =>
        setVehicle({ ...vehicle, vehicleNumber: e.target.value })
      }
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
    />
  </div>

  {/* FUEL TYPE */}
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      Fuel Type
    </label>

    <select
      value={vehicle.fuelType}
      onChange={(e) =>
        setVehicle({ ...vehicle, fuelType: e.target.value })
      }
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
    >
      <option value="petrol">Petrol</option>
      <option value="diesel">Diesel</option>
      <option value="electric">Electric</option>
    </select>
  </div>

</div>

<div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

  <h3 className="font-semibold text-slate-800 mb-3">
    Vehicle Preview
  </h3>

  <div className="grid sm:grid-cols-2 gap-4 text-sm">

    <div>
      <p className="text-slate-500">
        Vehicle Type
      </p>

      <p className="font-medium capitalize">
        {vehicle.vehicleType}
      </p>
    </div>

    <div>
      <p className="text-slate-500">
        Fuel Type
      </p>

      <p className="font-medium capitalize">
        {vehicle.fuelType}
      </p>
    </div>

  </div>

</div>
          {/* <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium">
            Save Vehicle
          </button> */}
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium">
  Register Vehicle
</button>
        </form>
      </div>
    </div>
  );
}
