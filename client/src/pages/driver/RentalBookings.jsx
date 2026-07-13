import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function RentalBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/rental-bookings/owner");

      setBookings(res.data.bookings);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16">
        <h1 className="text-3xl font-bold">
          Loading Rental Bookings...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

  <div className="flex items-start justify-between">

    <div>

      <p className="text-xs uppercase tracking-[0.25em] text-indigo-600 font-semibold">
        Driver Dashboard
      </p>

      <h1 className="text-4xl font-bold text-slate-900 mt-2">
        Rental Booking Management
      </h1>

      <p className="text-slate-500 mt-2">
        Review passenger bookings, rental status and payment information.
      </p>

    </div>

    <div className="text-right">

      <p className="text-sm text-slate-500">
        Total Bookings
      </p>

      <h2 className="text-5xl font-bold text-indigo-600">
        {bookings.length}
      </h2>

    </div>

  </div>

</div>

        {/* Empty */}

        {bookings.length === 0 && (

          <div className="bg-white mt-8 rounded-2xl border shadow p-16 text-center">

            <h2 className="text-2xl font-bold">

              No Rental Bookings

            </h2>

            <p className="text-slate-500 mt-3">

              Your rental bookings will appear here.

            </p>

          </div>

        )}

        {/* Booking Cards */}

        <div className="space-y-6 mt-8">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="
bg-white
rounded-3xl
border
border-slate-200
shadow-sm
hover:shadow-md
transition
p-8
"
            >

              <div className="flex justify-between">

                {/* Left */}

                <div className="flex gap-5">

                  <img
                    src={
                      booking.vehicle.images?.length
                        ? booking.vehicle.images[0]
                        : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                    }
                    alt=""
                    className="
w-52
h-36
rounded-2xl
object-cover
border
border-slate-200
"
                  />

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">

                      {booking.vehicle.vehicleName}

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
  Registration No. {booking.vehicle.vehicleNumber}
</p>

                    <div className="grid grid-cols-2 gap-8 mt-6">

  <div>

    <p className="text-xs uppercase text-slate-500 tracking-wide">
      Booked By
    </p>

    <p className="font-semibold text-slate-900 mt-1">
      {booking.passenger.name}
    </p>

  </div>

  <div>

    <p className="text-xs uppercase text-slate-500 tracking-wide">
      Phone Number
    </p>

    <p className="font-semibold text-slate-900 mt-1">
      {booking.passenger.phone}
    </p>

  </div>

</div>

                  </div>

                </div>

                {/* Right */}

                <div className="text-right">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                    {booking.bookingStatus}

                  </span>

                  <h2 className="text-4xl font-bold mt-4">

                    ₹{booking.totalRent}

                  </h2>

                  <p className="text-slate-500">

                    Token ₹{booking.bookingToken}

                  </p>

                  <p className="text-slate-500">

                    Remaining ₹{booking.remainingAmount}

                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/driver/rental-bookings/${booking._id}`
                      )
                    }
                    className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-xl"
                  >
                    View Details
                  </button>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-8 mt-6">

                <div>

                  <p className="text-slate-500 text-sm">

                    Pickup Date

                  </p>

                  <p className="font-semibold">

                    {new Date(
                      booking.startDate
                    ).toLocaleDateString()}

                  </p>

                </div>

                <div>

                  <p className="text-slate-500 text-sm">

                    Return Date

                  </p>

                  <p className="font-semibold">

                    {new Date(
                      booking.endDate
                    ).toLocaleDateString()}

                  </p>

                </div>

                <div>

                  <p className="text-slate-500 text-sm">

                    Rental Days

                  </p>

                  <p className="font-semibold">

                    {booking.totalDays} Days

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}