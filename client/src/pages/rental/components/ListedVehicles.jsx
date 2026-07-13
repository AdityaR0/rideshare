import { useEffect, useState } from "react";
import {
  getMyRentalVehicles,
  deleteRentalVehicle,
  toggleRentalVehicleStatus,
} from "../../../services/rentalService";

export default function ListedVehicles({
  refresh,
  refreshVehicles,
  setEditingVehicle,
}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchVehicles();
  // }, []);
  useEffect(() => {
  fetchVehicles();
}, [refresh]);

  const fetchVehicles = async () => {
    try {
      const data = await getMyRentalVehicles();
      setVehicles(data.rentalVehicles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteRentalVehicle(id);

// Refresh this card
fetchVehicles();

// Tell parent to refresh Registered Vehicles
refreshVehicles();

alert(response.message);;

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete vehicle"
      );
    }
  };

  const handleToggleStatus = async (id) => {

  try {

    const response =
      await toggleRentalVehicleStatus(id);

    alert(response.message);

    fetchVehicles();

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to update vehicle status"
    );

  }

};

  const vehicleIcon = (type) => {
    switch (type) {
      case "Car":
        return "🚗";
      case "Bike":
        return "🏍️";
      case "Scooter":
        return "🛵";
      default:
        return "🚘";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5">

      {/* Header */}

      <div className="flex justify-between items-center mb-4">

        <div>

          <h2 className="text-lg font-bold">
            Your Listed Vehicles
          </h2>

          <p className="text-xs text-gray-500">
            Manage your rental vehicles
          </p>

        </div>

        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          {vehicles.length} Vehicles
        </span>

      </div>

      {loading ? (

        <div className="text-center py-10">
          Loading...
        </div>

      ) : (

        <div className="max-h-[320px] overflow-y-auto pr-2 space-y-3">

          {vehicles.length === 0 ? (

            <div className="text-center text-gray-400 py-10">
              No rental vehicles added yet.
            </div>

          ) : (

            vehicles.map((vehicle) => (

              <div
                key={vehicle._id}
                className="border rounded-xl p-3 hover:shadow-md transition"
              >

                <div className="flex gap-3">

                  {/* Icon */}

                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">

  {vehicle.images && vehicle.images.length > 0 ? (

    <img
      src={vehicle.images[0]}
      alt={vehicle.vehicleName}
      className="w-full h-full object-cover"
    />

  ) : (

    <div className="w-full h-full flex items-center justify-center text-3xl">
      {vehicleIcon(vehicle.vehicleType)}
    </div>

  )}

</div>

                  {/* Details */}

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-semibold">
                          {vehicle.vehicleName}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {vehicle.vehicleNumber}
                        </p>

                      </div>

                      {/* <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          vehicle.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {vehicle.status}
                      </span> */}
                      <div className="flex flex-col items-end gap-2">

  <span
    className={`text-xs px-2 py-1 rounded-full ${
      vehicle.status === "AVAILABLE"
        ? "bg-green-100 text-green-700"
        : vehicle.status === "BOOKED"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {vehicle.status}
  </span>

  {vehicle.status !== "BOOKED" && (

    <button
      onClick={() =>
        handleToggleStatus(vehicle._id)
      }
      className={`text-[10px] px-2 py-1 rounded-lg text-white ${
        vehicle.status === "AVAILABLE"
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >

      {vehicle.status === "AVAILABLE"
        ? "Disable"
        : "Enable"}

    </button>

  )}

</div>

                    </div>

                    <div className="flex justify-between mt-3">

                      <div>

                        <p className="text-xs text-gray-500">
                          Rental Price
                        </p>

                        <p className="font-bold text-green-600">
                          ₹{vehicle.pricePerDay}/day
                        </p>

                      </div>

                      <div className="flex gap-2">

                        {/* <button className="text-xs border rounded-lg px-3 py-1 hover:bg-gray-100">
                          Edit
                        </button> */}
                        <button
  onClick={() => setEditingVehicle(vehicle)}
  className="text-xs border rounded-lg px-3 py-1 hover:bg-gray-100"
>
  Edit
</button>

                        <button
                          onClick={() =>
                            handleDelete(vehicle._id)
                          }
                          className="text-xs border rounded-lg px-3 py-1 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}