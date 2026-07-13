import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function MyRentals() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await api.get("/rental-bookings/my");

      setBookings(res.data.bookings);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-50 py-10">

      <div className="max-w-7xl mx-auto">

       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

    <div>

      <p className="text-sm font-medium tracking-widest uppercase text-indigo-600">
        Rental Dashboard
      </p>

      <h1 className="text-4xl font-bold text-slate-900 mt-2">
        My Rentals
      </h1>

      <p className="text-slate-500 mt-3 text-base">
        Manage your booked, active, completed and cancelled rental vehicles.
      </p>

    </div>

    <div className="mt-8 lg:mt-0 text-left lg:text-right">

      <p className="text-sm text-slate-500">
        Total Bookings
      </p>

      <h2 className="text-5xl font-bold text-indigo-600 mt-1">
        {bookings.length}
      </h2>

    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">
        Booked
      </p>
      <h3 className="text-2xl font-bold mt-2">
        {
          bookings.filter(
            (b) => b.bookingStatus === "BOOKED"
          ).length
        }
      </h3>
    </div>

    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">
        Active
      </p>
      <h3 className="text-2xl font-bold mt-2">
        {
          bookings.filter(
            (b) => b.bookingStatus === "ACTIVE"
          ).length
        }
      </h3>
    </div>

    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">
        Completed
      </p>
      <h3 className="text-2xl font-bold mt-2">
        {
          bookings.filter(
            (b) => b.bookingStatus === "COMPLETED"
          ).length
        }
      </h3>
    </div>

    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">
        Cancelled
      </p>
      <h3 className="text-2xl font-bold mt-2">
        {
          bookings.filter(
            (b) => b.bookingStatus === "CANCELLED"
          ).length
        }
      </h3>
    </div>

  </div>

</div>

        {loading ? (

          <div className="mt-8 text-center">

            Loading...

          </div>

        ) : bookings.length === 0 ? (

          <div className="mt-8 bg-white rounded-2xl shadow border p-8 text-center">

            No Rental Bookings Found.

          </div>

        ) : (

          <div className="space-y-6 mt-8">

            {bookings.map((booking) => (

              <div
                key={booking._id}
                className="bg-white rounded-2xl border shadow-sm p-6"
              >

                <div className="flex gap-6">

                  <img
                    src={
                      booking.vehicle.images?.length
                        ? booking.vehicle.images[0]
                        : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                    }
                    alt={booking.vehicle.vehicleName}
                    className="w-52 h-36 rounded-xl object-cover"
                  />

                  <div className="flex-1">

                    <h2 className="text-2xl font-bold">

                      {booking.vehicle.vehicleName}

                    </h2>

                    <p className="text-slate-500 mt-1">

                      {booking.vehicle.vehicleNumber}

                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-6">

                      <div>

                        <p className="text-sm text-slate-500">

                          Start Date

                        </p>

                        <p className="font-semibold">

                          {new Date(
                            booking.startDate
                          ).toLocaleDateString()}

                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-slate-500">

                          End Date

                        </p>

                        <p className="font-semibold">

                          {new Date(
                            booking.endDate
                          ).toLocaleDateString()}

                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="text-right">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                      {booking.bookingStatus}

                    </span>

                    <h3 className="text-3xl font-bold mt-6">

                      ₹{booking.totalRent}

                    </h3>

                    <p className="text-slate-500 mt-2">

                      Token Paid ₹{booking.bookingToken}

                    </p>

                    <p className="text-slate-500">

                      Remaining ₹{booking.remainingAmount}

                    </p>
                    <button
  onClick={() =>
    navigate(`/passenger/my-rentals/${booking._id}`)
  }
  className="
    mt-5
    w-full
    bg-indigo-600
    hover:bg-indigo-700
    text-white
    py-2
    rounded-lg
    transition
  "
>
  View Details
</button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}