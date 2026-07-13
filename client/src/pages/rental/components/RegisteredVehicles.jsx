import { useEffect, useState } from "react";
import { getMyRegisteredVehicles } from "../../../services/driverService";
import { getMyRentalVehicles } from "../../../services/rentalService";

// export default function RegisteredVehicles() {
// export default function RegisteredVehicles({
//   setSelectedVehicle,
// }) {
export default function RegisteredVehicles({
  refresh,
  setSelectedVehicle,
}) {

  const [vehicles, setVehicles] = useState([]);
  const [rentalVehicles, setRentalVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchVehicles();
  // }, []);
  useEffect(() => {
  fetchVehicles();
}, [refresh]);

  // const fetchVehicles = async () => {
  //   try {

  //     const data = await getMyRegisteredVehicles();

  //     setVehicles(data.vehicles || []);

  //   } catch (err) {

  //     console.error(err);

  //   } finally {

  //     setLoading(false);

  //   }
  // };
 const fetchVehicles = async () => {
  try {

    const data = await getMyRegisteredVehicles();

    console.log("Registered Vehicles");
    console.log(data);

    setVehicles(data.vehicles || []);

    const rentalRes = await getMyRentalVehicles();

    // console.log("Rental Vehicles");
    // console.log(rentalRes);
    console.log("Rental Vehicles");
console.log(rentalRes.rentalVehicles);

    // setRentalVehicles(rentalRes.vehicles || []);
    setRentalVehicles(rentalRes.rentalVehicles || []);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5">

      {/* Header */}

      <div className="flex justify-between items-center mb-4">

        <div>

          <h2 className="text-lg font-bold">
            Registered Ride Vehicles
          </h2>

          <p className="text-xs text-gray-500">
            Vehicles already added for Ride Sharing
          </p>

        </div>

        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">

          {vehicles.length} Vehicles

        </span>

      </div>

      {loading ? (

        <div className="text-center py-8 text-gray-500">

          Loading...

        </div>

      ) : (

        <div className="max-h-[260px] overflow-y-auto pr-2 space-y-3">

          {vehicles.length === 0 ? (

            <div className="text-center py-8 text-gray-400">

              No registered ride vehicles found.

            </div>

          ) : (

              vehicles.map((vehicle) => {

  // const alreadyListed = rentalVehicles.some(
  //   (rent) => rent.vehicleNumber === vehicle.number
  // );
  console.log("Vehicle:", vehicle.number);

console.log(
  rentalVehicles.map(v => v.vehicleNumber)
);
  const alreadyListed = rentalVehicles.some(
  (rent) =>
    rent.vehicleNumber.toLowerCase() ===
    vehicle.number.toLowerCase()
);

  return (

              <div
                key={vehicle._id}
                className="border rounded-xl p-3 hover:shadow transition"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-semibold">

                      {vehicle.name}

                    </h3>

                    <p className="text-xs text-gray-500 mt-1">

                      {vehicle.number}

                    </p>

                    <p className="text-xs text-gray-500 mt-1">

                      Type : {vehicle.type}

                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">

                    Verified ✓

                  </span>

                </div>

                {/* <button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 text-sm"
                >
                  Use For Rental
                </button> */}
                {/* <button
  onClick={() => setSelectedVehicle(vehicle)}
  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 text-sm"
>
  Use For Rental
</button> */}
{alreadyListed ? (

  <button
    disabled
    className="w-full mt-4 bg-gray-300 text-gray-700 rounded-lg h-9 text-sm cursor-not-allowed"
  >
    ✔ Listed For Rent
  </button>

) : (

  <button
    onClick={() => setSelectedVehicle(vehicle)}
    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 text-sm"
  >
    Use For Rental
  </button>

)}

            </div>

);

})

          )}

        </div>

      )}

    </div>
  );
}