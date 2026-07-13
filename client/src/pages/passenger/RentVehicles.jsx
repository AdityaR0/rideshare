import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Car,
  Bike,
  Truck,
  Bus,
  Fuel,
  Star,
} from "lucide-react";

export default function RentVehicles() {
    const navigate = useNavigate();
const [vehicleType, setVehicleType] = useState("All");

const [search, setSearch] = useState("");

const [vehicles, setVehicles] = useState([]);

const [loading, setLoading] = useState(true);

const [sortBy, setSortBy] = useState("Recommended");

useEffect(() => {
  fetchVehicles();
}, []);

const fetchVehicles = async () => {
  try {
    const res = await api.get("/rental-vehicles");

    setVehicles(res.data.rentalVehicles);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const filteredVehicles = vehicles.filter((vehicle) => {

  const matchesSearch =

    vehicle.vehicleName
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    vehicle.pickupAddress
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesType =

    vehicleType === "All" ||

    vehicle.vehicleType === vehicleType;

  return matchesSearch && matchesType;

});
const sortedVehicles = [...filteredVehicles];

if (sortBy === "Price Low to High") {
  sortedVehicles.sort(
    (a, b) => a.pricePerDay - b.pricePerDay
  );
}

if (sortBy === "Price High to Low") {
  sortedVehicles.sort(
    (a, b) => b.pricePerDay - a.pricePerDay
  );
}
 
  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* HERO */}

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="grid lg:grid-cols-2 items-center">

            <div className="p-10">

              <h1 className="text-5xl font-bold text-slate-900">
                Rent a Vehicle
              </h1>

              <p className="text-slate-500 mt-4 text-lg leading-8">
                Choose from verified cars, bikes, scooters and vans listed by
                trusted RideShare members.
              </p>

            </div>

            <div className="hidden lg:flex justify-end">

              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                className="h-72 w-full object-cover"
              />

            </div>

          </div>

        </div>

        {/* SEARCH */}

        {/* <div className="bg-white rounded-2xl border shadow-sm p-6 mt-8">

          <div className="grid lg:grid-cols-4 gap-5">

            <div>

              <label className="text-sm font-semibold">
                Pickup Location
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-3">

                <MapPin size={18} className="text-slate-500"/>

                <input
                  placeholder="Enter pickup location"
                  className="w-full p-3 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="text-sm font-semibold">
                Start Date
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-3">

                <Calendar size={18}/>

                <input
                  type="date"
                  className="w-full p-3 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="text-sm font-semibold">
                End Date
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-3">

                <Calendar size={18}/>

                <input
                  type="date"
                  className="w-full p-3 outline-none"
                />

              </div>

            </div>

            <button
              className="
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              rounded-xl
              mt-7
              font-semibold
              flex
              justify-center
              items-center
              gap-2
              "
            >
              <Search size={18}/>
              Search Vehicles
            </button>

          </div>

        </div> */}
        {/* SEARCH */}

<div className="bg-white rounded-2xl border shadow-sm p-6 mt-8">

    <h2 className="text-xl font-bold">
        Search Vehicles
    </h2>

    <p className="text-slate-500 mt-1">
        Search by vehicle name or pickup location.
    </p>

    <div className="flex flex-col lg:flex-row gap-4 mt-5">

        <div className="flex-1 flex items-center border rounded-xl px-4">

            <Search
                size={20}
                className="text-slate-400"
            />

            <input
                type="text"
                placeholder="Search Royal Enfield, BMW, Kestopur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 outline-none"
            />

        </div>

        <button
            className="
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            px-8
            rounded-xl
            font-semibold
            "
        >
            Search
        </button>

    </div>

</div>

        {/* MAIN */}

        <div className="grid lg:grid-cols-4 gap-8 mt-8">

          {/* FILTER */}

          <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit">

            <div className="flex justify-between items-center mb-6">

              <h2 className="font-bold text-xl">
                Filters
              </h2>

              <button
  onClick={() => {
    setSearch("");
    setVehicleType("All");
  }}
  className="text-indigo-600 text-sm"
>
  Reset
</button>

            </div>

            <p className="font-semibold mb-4">
              Vehicle Type
            </p>

            <div className="grid grid-cols-2 gap-3">

              {[
  {
    name:"All",
    icon:<Search size={18}/>
  },
  {
    name:"Car",
    icon:<Car size={18}/>
  },
  {
    name:"Bike",
    icon:<Bike size={18}/>
  },
  {
    name:"Scooter",
    icon:<Truck size={18}/>
  },
  {
    name:"Van",
    icon:<Bus size={18}/>
  }
].map(item=>(
                <button
                  key={item.name}
                  onClick={()=>setVehicleType(item.name)}
                  className={`border rounded-xl py-3 flex flex-col items-center gap-2 transition ${
                    vehicleType===item.name
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "hover:border-indigo-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}

            </div>

          </div>

          {/* VEHICLES */}

          <div className="lg:col-span-3">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Available Vehicles
              </h2>

              <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border rounded-xl px-4 py-2"
>

                <option>Recommended</option>

                <option>Price Low to High</option>

                <option>Price High to Low</option>

              </select>

            </div>
{loading ? (

  <div className="text-center py-20 text-lg font-semibold text-slate-500">
    Loading Vehicles...
  </div>

) : filteredVehicles.length === 0 ? (

  <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">

    <Search
      size={55}
      className="mx-auto text-slate-300"
    />

    <h2 className="text-2xl font-bold mt-5">
      No Vehicles Found
    </h2>

    <p className="text-slate-500 mt-3">
      No vehicle found matching
      <span className="font-semibold">
        {" "}{search}
      </span>
    </p>

    <p className="text-slate-400 mt-2">
      Try another vehicle name or pickup location.
    </p>

  </div>

) : (

  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

    {sortedVehicles.map((vehicle) => (

      <div
        key={vehicle._id}
        className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition"
      >

        <img
          src={
            vehicle.images?.length > 0
              ? vehicle.images[0]
              : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
          }
          alt={vehicle.vehicleName}
          className="h-52 w-full object-cover"
        />

        <div className="p-5">

          <div className="flex justify-between">

            <h3 className="font-bold text-lg">
              {vehicle.vehicleName}
            </h3>

            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              {vehicle.status}
            </span>

          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-500">

            <p>{vehicle.vehicleType}</p>

            {/* <p>{vehicle.fuelType}</p>

            <p>{vehicle.transmission}</p>

            <p>{vehicle.seats} Seats</p> */}

            <p>{vehicle.pickupAddress}</p>

          </div>

          <div className="flex justify-between items-center mt-6">

            <div>

              <p className="text-3xl font-bold text-indigo-600">
                ₹{vehicle.pricePerDay}
              </p>

              <span className="text-sm text-slate-400">
                /day
              </span>

            </div>

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl"
              onClick={() =>
                navigate(`/passenger/rental/${vehicle._id}`)
              }
            >
              Book Now
            </button>

          </div>

        </div>

      </div>

    ))}

  </div>

)}

          </div>

        </div>

      </div>

    </div>
  );
}