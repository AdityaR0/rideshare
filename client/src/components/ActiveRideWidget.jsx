import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function ActiveRideWidget() {
  const [ride, setRide] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(
  localStorage.getItem("carpool-user")
);

  useEffect(() => {
    const fetchActiveRide = async () => {
      try {
        const res = await api.get("/rides/active/current");

        // if (res.data.success && res.data.ride) {
        //   setRide(res.data.ride);
        // } else {
        //   setRide(null);
        // }
        if (res.data.success && res.data.ride) {

  setRide(res.data.ride);

  setBookingId(res.data.bookingId);

} else {

  setRide(null);
  setBookingId(null);

}
        // } catch (err) {
        //   console.log(err);
        //   setRide(null);
        // }
}catch (err) {

  if (err.response?.status === 401) {
    setRide(null);
    return;
  }

  console.log(err);
  setRide(null);
}
    };

    // fetchActiveRide();

    // const interval = setInterval(fetchActiveRide, 10000);
    if (!user) return;

fetchActiveRide();

const interval = setInterval(fetchActiveRide, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!ride) return null;

//   const handleClick = () => {
//     navigate(`/driver/ride/${ride._id}`);
//   };
const handleClick = () => {

  if (user?.role === "driver") {

    navigate(`/driver/ride/${ride._id}`);

  } else {

    navigate(`/passenger/ride/${bookingId}`);

  }

};

  return (
    <div
      onClick={handleClick}
      className="
        fixed
        bottom-24
        right-5
        z-50
        w-72
        cursor-pointer
        rounded-2xl
        bg-indigo-600
        text-white
        shadow-2xl
        p-4
        hover:scale-105
        transition
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">
          🚗 Active Ride
        </h3>

        <span className="text-xs bg-white text-indigo-600 px-2 py-1 rounded-full">
          {ride.status}
        </span>
      </div>

      <p className="mt-3 font-medium">
        {ride.origin} → {ride.destination}
      </p>

      <p className="text-sm opacity-90 mt-1">
        {new Date(ride.date).toLocaleString()}
      </p>

      <div className="mt-3 text-sm underline">
        Click to view details
      </div>
    </div>
  );
}