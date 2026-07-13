// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import L from "leaflet";
import "leaflet-routing-machine";
import api from "../utils/axios";
import "leaflet/dist/leaflet.css";
import BookingPopup from "../components/BookingPopup";


// ---------- DATA SHARED BETWEEN VIEWS ----------

// Hard-coded demo rides
// const demoRides = [
//   {
//     id: 1,
//     from: "Ballygunge",
//     to: "Dum Dum",
//     time: "09:00 AM",
//     price: "₹180",
//     driver: "Aarav Singh",
//     rating: "4.8",
//   },
//   {
//     id: 2,
//     from: "Ballygunge",
//     to: "Salt Lake",
//     time: "10:30 AM",
//     price: "₹160",
//     driver: "Sneha Das",
//     rating: "4.6",
//   },
//   {
//     id: 3,
//     from: "Howrah",
//     to: "New Town",
//     time: "06:15 PM",
//     price: "₹210",
//     driver: "Rahul Verma",
//     rating: "4.9",
//   },
// ];

// City → coordinates (rough positions in Kolkata)
const cityCoords = {
  Ballygunge: [22.5204, 88.365],
  "Dum Dum": [22.622, 88.4],
  "Salt Lake": [22.5867, 88.4178],
  Howrah: [22.5958, 88.2636],
  "New Town": [22.5862, 88.479],
};

// Features for public landing page
const marketingFeatures = [
  {
    title: "Save Money",
    desc: "Split travel costs with other passengers and save up to 70% on your journey expenses.",
    icon: "💰",
  },
  {
    title: "Eco-Friendly",
    desc: "Reduce carbon emissions by sharing rides and help protect our planet for future generations.",
    icon: "🌿",
  },
  {
    title: "Meet People",
    desc: "Connect with fellow travelers and make new friends during your journey.",
    icon: "🧑‍🤝‍🧑",
  },
  {
    title: "Verified Users",
    desc: "All users are verified with ID, phone, and email for maximum safety and trust.",
    icon: "✅",
  },
  {
    title: "Real-Time Updates",
    desc: "Get instant notifications about ride status, driver location, and schedule changes.",
    icon: "⏱️",
  },
  {
    title: "In-App Messaging",
    desc: "Communicate securely with drivers and passengers through our built-in chat system.",
    icon: "💬",
  },
];

const steps = [
  {
    num: 1,
    title: "Sign Up",
    desc: "Create your free account and verify your identity for a safe experience.",
  },
  {
    num: 2,
    title: "Find a Ride",
    desc: "Search for rides going your way or offer your own ride to passengers.",
  },
  {
    num: 3,
    title: "Travel Together",
    desc: "Meet your driver or passengers and enjoy a safe, comfortable journey.",
  },
];

const safetyPoints = [
  {
    title: "Identity Verification",
    desc: "All users must verify their email, phone number, and ID before joining.",
  },
  {
    title: "Ratings & Reviews",
    desc: "Read reviews from other users and make informed decisions.",
  },
  {
    title: "24/7 Support",
    desc: "Our support team is always available to help with any concerns.",
  },
  {
    title: "Emergency Assistance",
    desc: "Built-in SOS and emergency tools to keep you safe on every trip.",
  },
];

const marketingTestimonials = [
  {
    name: "Sarah Johnson",
    role: "Daily Commuter",
    text: "RideShare has completely changed how I commute. I've saved hundreds of dollars and met amazing people along the way!",
  },
  {
    name: "Michael Chen",
    role: "RideShare Driver",
    text: "As a driver, I love being able to cover my fuel costs while meeting new people. The verification process makes me feel safe.",
  },
  {
    name: "Emily Rodriguez",
    role: "Weekend Traveler",
    text: "The app is so easy to use! I can find rides in seconds and the messaging feature makes coordination a breeze.",
  },
];

// ---------- MAIN EXPORT ----------

export default function Home() {
  const { user } = useAuth();

  // Not logged in → show public marketing landing page
  if (!user) {
    return <PublicLanding />;
  }

  // Logged in
  if (user.role === "passenger" || user.role === "driver") {
    return <LoggedInHome user={user} />;
  }

  // Admin or any other role → reuse public landing style
  return <PublicLanding />;
}

// ---------- PUBLIC LANDING PAGE (BEFORE LOGIN) ----------

function PublicLanding() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      {/* Gradient top strip like your design */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-14 w-full fixed top-0 left-0 z-0" />

      {/* Top nav */}
      <header className="fixed top-0 inset-x-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6 text-white">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/40 flex items-center justify-center text-lg">
              🚗
            </div>
            <span className="text-lg font-semibold">RideShare</span>
          </button>

          {/* Center links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:opacity-80"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:opacity-80"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("safety")}
              className="hover:opacity-80"
            >
              Safety
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="hover:opacity-80"
            >
              Testimonials
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium hover:opacity-80"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-sm font-semibold shadow hover:bg-slate-100"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* HERO */}
        <section
          id="hero"
          className="max-w-6xl mx-auto px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10"
        >
          {/* Left side text */}
          <div className="flex-1 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-slate-900/5 text-slate-700 border border-slate-200">
              <span className="text-yellow-500 text-sm">☀️</span>
              Trusted by 10,000+ users
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Travel Smarter,
              <br />
              Together.
            </h1>

            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Share your journey, split the costs, and reduce your carbon
              footprint. Connect with verified travelers heading your way.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Get Started Free
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="px-6 py-2.5 rounded-full border border-slate-300 text-sm font-semibold hover:bg-slate-50"
              >
                Learn More
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm pt-2">
              <div>
                <p className="text-lg font-bold">4.9</p>
                <p className="text-slate-500">User Rating</p>
              </div>
              <div>
                <p className="text-lg font-bold">50K+</p>
                <p className="text-slate-500">Rides Shared</p>
              </div>
              <div>
                <p className="text-lg font-bold">$2M+</p>
                <p className="text-slate-500">Saved</p>
              </div>
            </div>
          </div>

          {/* Right hero image */}
          <div className="flex-1 w-full">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 h-64 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1695211747490-a85d5fdcc23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBoaWdod2F5fGVufDF8fHx8MTc2MTc1MDEyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Cars on a modern highway"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="bg-slate-50 border-y border-slate-100"
        >
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-2">
                Features
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Why Choose RideShare?
              </h2>
              <p className="text-sm md:text-base text-slate-500">
                Experience the future of shared transportation with our
                comprehensive platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {marketingFeatures.map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-2"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">
                    {f.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-2">
              Simple Process
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              How It Works
            </h2>
            <p className="text-sm md:text-base text-slate-500 mb-10">
              Get started in just three simple steps.
            </p>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {steps.map((step) => (
                <div key={step.num} className="space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-base">{step.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section
          id="safety"
          className="bg-slate-50 border-y border-slate-100"
        >
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-10">
            {/* Left safety image */}
            <div className="flex-1 w-full">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 h-72 md:h-96">
                <img
                  src="https://images.unsplash.com/photo-1680428605711-cbce24bb22f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBlb3BsZSUyMGNhcnxlbnwxfHx8fDE3NjE2NTM3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Happy people in a car"
                  className="w-full h-full object-cover object-[50%_60%]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right text */}
            <div className="flex-1 space-y-4">
              <span className="inline-flex text-xs font-medium px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200">
                Your Safety First
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                Travel With Confidence
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                Your safety is our top priority. We&apos;ve implemented
                comprehensive security measures to ensure every journey is
                secure.
              </p>

              <div className="space-y-3 text-sm">
                {safetyPoints.map((point) => (
                  <div key={point.title} className="flex gap-3 items-start">
                    <span className="mt-1 text-lg">✅</span>
                    <div>
                      <p className="font-semibold">{point.title}</p>
                      <p className="text-xs md:text-sm text-slate-500">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-2">
                Testimonials
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                What Our Users Say
              </h2>
              <p className="text-sm md:text-base text-slate-500">
                Join thousands of satisfied travelers who trust RideShare.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {marketingTestimonials.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 bg-slate-50/60"
                >
                  <div className="flex gap-1 text-yellow-400 text-sm">
                    {"★★★★★"}
                  </div>
                  <p className="text-sm text-slate-700">“{t.text}”</p>
                  <div className="pt-2">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------- LOGGED-IN HOME (AFTER LOGIN – PASSENGER / DRIVER) ----------

function LoggedInHome({ user }) {
  const navigate = useNavigate();
  const role = user?.role;

  // search form state (for passenger)
  const [search, setSearch] = useState({
  from: "",
  to: "",
  date: "",
  time: "",
});

  // rides shown in the list (initially none)
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  // driver "offer ride" form state
  // const [driverRide, setDriverRide] = useState({
  //   source: "",
  //   destination: "",
  //   datetime: "",
  //   seats: "1",
  //   carModel: "Sedan",
  // });
  // const [driverRide, setDriverRide] = useState({
  // origin: "",
  // destination: "",
  // date: "",
  // seatsAvailable: 1,
  // });
  const [driverRide, setDriverRide] = useState({
  origin: "",
  destination: "",
  date: "",
  seatsAvailable: 1,
  vehicleId: "", // ✅ ADD THIS
});


  // SEARCH HANDLERS (passenger)
  const handleSearchChange = (field) => (e) => {
    setSearch((prev) => ({ ...prev, [field]: e.target.value }));
  };

  
  async function getCoords(place) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
  );
  const data = await res.json();

  if (!data[0]) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

  // const handleSearch = () => {
  //   const filtered = demoRides.filter(
  //     (r) =>
  //       (search.from ? r.from === search.from : true) &&
  //       (search.to ? r.to === search.to : true)
  //   );
  //   setResults(filtered);
  // };
  const handleSearch = async () => {
  try {
    // const res = await api.get("/rides");

    const res = await api.get("/rides", {
  params: {
    femaleOnly,
  },
});

    const filtered = res.data.filter((ride) => {
      const rideDate = new Date(ride.date);

      // convert to YYYY-MM-DD
      const rideDay = rideDate.toISOString().slice(0, 10);

      const fromMatch = ride.origin === search.from;
      const toMatch = ride.destination === search.to;

      // date match
      const dateMatch = search.date
        ? rideDay === search.date
        : true;

      // time match with ±1 hour tolerance
      let timeMatch = true;
      if (search.time) {
        const searchDateTime = new Date(`${search.date}T${search.time}`);
        const diffMinutes = Math.abs(
          (rideDate - searchDateTime) / (1000 * 60)
        );
        timeMatch = diffMinutes <= 60;
      }

      return fromMatch && toMatch && dateMatch && timeMatch;
    });

    setResults(filtered);
    setSearched(true);
  } catch (error) {
    console.error(error);
    alert("❌ Failed to fetch rides");
  }
};


  // DRIVER "OFFER RIDE" HANDLERS
  const handleDriverRideChange = (field) => (e) => {
    setDriverRide((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // const handleDriverRideSubmit = (e) => {
  //   e.preventDefault();
  //   if (!driverRide.source || !driverRide.destination || !driverRide.datetime) {
  //     alert("Please fill Source, Destination and Departure Date & Time.");
  //     return;
  //   }
  const handleDriverRideSubmit = async (e) => {
  e.preventDefault();

  try {
    if (
      !driverRide.origin ||
      !driverRide.destination ||
      !driverRide.date
    ) {
      alert("Please fill all required fields");
      return;
    }


    if (!driverRide.vehicleId) {
  alert("Please select a vehicle");
  return;
}

const selectedVehicle = user.vehicles[driverRide.vehicleId];
const fuelType = selectedVehicle.fuelType;

    // Simple auto-price logic (teacher-friendly)
    const BASE_FARE = 50;
    const pricePerSeat =
      BASE_FARE + driverRide.origin.length * 5;

    await api.post("/rides", {
      origin: driverRide.origin,
      destination: driverRide.destination,
      date: driverRide.date,
      seatsAvailable: driverRide.seatsAvailable,
      pricePerSeat,
  vehicleType: selectedVehicle.vehicleType,
  vehicleName: selectedVehicle.vehicleName,
  vehicleNumber: selectedVehicle.vehicleNumber,
  fuelType: selectedVehicle.fuelType,
    });

    alert("✅ Ride created successfully");

    setDriverRide({
      origin: "",
      destination: "",
      date: "",
      seatsAvailable: 1,
    });
  } catch (error) {
    console.error(error);
    alert("❌ Failed to create ride");
  }
};

  // BOOK SEAT HANDLER (passenger)
  // const handleBookSeat = (ride) => {
  //   if (role !== "passenger") {
  //     alert("Only Passenger accounts can book rides in this demo.");
  //     return;
  //   }

  //   const seatsStr = window.prompt(
  //     "Enter number of seats you want to book:",
  //     "1"
  //   );

  //   if (seatsStr === null) return;

  //   const seats = parseInt(seatsStr, 10);
  //   if (Number.isNaN(seats) || seats <= 0) {
  //     alert("Please enter a valid number of seats.");
  //     return;
  //   }

  //   navigate("/payment", {
  //     state: {
  //       rideId: ride._id,
  //       seats,
  //       ride,
  //     },
  //   });
  // };
//   

// const handleBookSeat = (ride) => {
  const handleBookSeat = async (ride) => {
  if (role !== "passenger") {
    alert("Only Passenger accounts can book rides.");
    return;
  }

  // Step 1: ask booking type
  const bookingType = window.prompt(
    "Who are you booking for?\n\n1 = Myself\n2 = Someone Else",
    "1"
  );

  if (!bookingType) return;

  // Step 2: ask seats
  // const seatsStr = window.prompt(
  //   "Enter number of seats you want to book:",
  //   "1"
  // );
  const seatsStr = window.prompt(
  `Enter number of seats you want to book (Max ${ride.seatsAvailable})`,
  "1"
);

  if (!seatsStr) return;

  const seats = parseInt(seatsStr);

  if (isNaN(seats) || seats <= 0) {
    alert("Invalid seat number");
    return;
  }
  if (seats > ride.seatsAvailable) {
  alert(`❌ Only ${ride.seatsAvailable} seats available`);
  return;
}

  const passengers = [];

  for (let i = 0; i < seats; i++) {

    let name = "";
    let phone = "";

    // If booking for myself first passenger auto-fill
    if (i === 0 && bookingType === "1") {
      name = user.name;
      phone = user.phone || "";
    } else {
      name = window.prompt(`Enter name of passenger ${i + 1}`);
      if (!name) {
        alert("Passenger name required");
        return;
      }

      phone = window.prompt(`Enter phone of passenger ${i + 1}`);
    }

    passengers.push({
      name,
      phone
    });
  }

  navigate("/payment", {
    state: {
      rideId: ride._id,
      seats,
      passengers,
      ride
    },
  });
};

  // LEAFLET MAP SETUP (for passenger search)
  const mapContainerRef = useRef(null); // div element
  const mapRef = useRef(null); // Leaflet map instance
  const layersRef = useRef([]); // markers + polylines
  const routingRef = useRef(null);


  // Create map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || role !== "passenger")
      return;

    const map = L.map(mapContainerRef.current).setView(
      [22.5726, 88.3639], // Kolkata center
      11
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
  }, [role]);

  // Update markers / routes whenever results change
  useEffect(() => {
  if (role !== "passenger") return;

  const map = mapRef.current;
  if (!map) return;

  async function drawRoute() {
    // remove previous route
    if (routingRef.current) {
      map.removeControl(routingRef.current);
      routingRef.current = null;
    }

    if (results.length === 0) return;

    // Show route of first result
    const ride = results[0];

    // Convert location → lat long
    const getCoords = async (place) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );
      const data = await res.json();
      if (!data[0]) return null;
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    };

    const from = await getCoords(ride.origin);
    const to = await getCoords(ride.destination);
    if (!from || !to) return;

    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1]),
      ],
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      show: false,
    }).addTo(map);

    map.fitBounds([
      L.latLng(from[0], from[1]),
      L.latLng(to[0], to[1]),
    ]);
  }

  drawRoute();
}, [results, role]);


  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* HERO SECTION (gradient, like your old design) */}
      {/* <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"> */}
      <section className="bg-gradient-to-br from-slate-500 via-indigo-900 to-slate-800 text-white">

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          {/* Left */}
          <div className="flex-1 space-y-4">
            <p className="text-xs tracking-[0.3em] uppercase text-indigo-100">
              Carpool Ride Sharing
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Save Money, Save Fuel,
              <br />
              Share Your Commute.
            </h1>
            <p className="text-sm md:text-base text-indigo-100 max-w-xl">
              Connect passengers and drivers securely with seat booking, SOS
              alerts and ride reviews. Built as a full-stack project using
              React, Node.js and MongoDB.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (role === "passenger") navigate("/passenger/dashboard");
                  else if (role === "driver") navigate("/driver/dashboard");
                  else if (role === "admin") navigate("/admin/dashboard");
                  else navigate("/");
                }}
                className="px-6 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold shadow-md hover:bg-slate-100"
              >
                Go to Dashboard
              </button>
              <button
                // onClick={() => navigate("/review")} 
                onClick={() =>
    navigate(
      role === "passenger"
        ? "/passenger/my-rides"
        : "/driver/my-rides"
    )
  }
                className="px-6 py-2.5 rounded-full border border-white/60 text-sm font-semibold hover:bg-white/10"
              >
                View My Rides
              </button>
            </div>
          </div>

          {/* Right – quick actions */}
          <div className="flex-1 w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 md:p-6 shadow-xl">
              <p className="text-xs font-semibold text-indigo-100 uppercase tracking-[0.2em] mb-3">
                Quick actions for you
              </p>
              <p className="text-sm mb-3">
                Welcome back{" "}
                <span className="font-semibold">{user.name || "Rider"}</span>!
                Choose what you want to do now.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {role === "passenger" && (
                  <>
                    <button
                      // onClick={() => navigate("/passenger/dashboard")}
                      onClick={() => window.scrollTo({
  top: 500,
  behavior: "smooth"
})}
                      className="bg-white text-slate-900 rounded-xl px-4 py-3 text-left shadow-sm hover:bg-slate-100"
                    >
                      🔍 Search rides & book seats
                    </button>
                    <button
                      // onClick={() => navigate("/review")}
                      onClick={() => navigate("/passenger/rent-vehicles")}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left hover:bg-white/5"
                    >
                      🚗 Rent Vehicles
                    </button>
                    <button
                   onClick={async () => {
  try {
    // Get JWT token stored after login
    const token = localStorage.getItem("carpool-token");

    // Send request with Authorization header
    const res = await fetch(
`${import.meta.env.VITE_API_BASE_URL}/sos/trigger`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("✅ SOS alert sent successfully.");
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    alert("❌ Error sending SOS alert: " + err.message);
  }
}}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left hover:bg-white/5"
                    >
                      🚨 Check SOS & alerts
                    </button>
                  </>
                )}
                {role === "driver" && (
                  <>
                    <button
                      // onClick={() => navigate("/driver/dashboard")}
                      onClick={() =>
  document
    .getElementById("create-ride-section")
    ?.scrollIntoView({ behavior: "smooth" })
}
                      className="bg-white text-slate-900 rounded-xl px-4 py-3 text-left shadow-sm hover:bg-slate-100"
                    >
                      ➕ Create / offer a ride
                    </button>
                    {/* <button
                      onClick={() => navigate("/driver/dashboard")}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left hover:bg-white/5"
                    >
                      🚙 Manage vehicle & profile
                    </button> */}
                    <button
  onClick={() => navigate("/driver/rent-vehicle")}
  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left hover:bg-white/5"
>
  🚗 Rent Vehicle
</button>
                    <button
                      // onClick={() => navigate("/driver/dashboard")}
                      onClick={() => navigate("/driver/my-rides")}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left hover:bg-white/5"
                    >
                      ⭐ View your ratings
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MID SECTION */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
          {role === "driver" ? (
            /* ---------- DRIVER: OFFER NEW RIDE FORM ---------- */
            // <div className="max-w-3xl mx-auto">
            <div
  id="create-ride-section"
  className="max-w-3xl mx-auto"
>
              <h2 className="text-2xl font-semibold text-slate-900 text-center mb-1">
                Create a Carpool Listing
              </h2>
              <p className="text-sm text-slate-500 text-center mb-6">
                Enter your travel details to offer a ride to passengers.
              </p>

              <form
                onSubmit={handleDriverRideSubmit}
                className="bg-white rounded-3xl shadow-xl border border-slate-200 px-6 py-7 space-y-6"
              >
                <h3 className="text-xl font-semibold text-emerald-700 text-center">
                  Offer a New Ride
                </h3>

                {/* <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Source Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., College Main Gate"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={driverRide.source}
                      onChange={handleDriverRideChange("source")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., City Bus Stand"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={driverRide.destination}
                      onChange={handleDriverRideChange("destination")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Departure Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={driverRide.datetime}
                      onChange={handleDriverRideChange("datetime")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Available Seats
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={driverRide.seats}
                      onChange={handleDriverRideChange("seats")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Car Model
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={driverRide.carModel}
                      onChange={handleDriverRideChange("carModel")}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="SUV">SUV</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div> */}
                <div className="grid md:grid-cols-2 gap-4">
  {/* SOURCE */}
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      Source Location
    </label>
    <input
      type="text"
      placeholder="e.g., College Main Gate"
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      value={driverRide.origin}
      onChange={(e) =>
        setDriverRide({ ...driverRide, origin: e.target.value })
      }
    />
  </div>

  {/* DESTINATION */}
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      Destination
    </label>
    <input
      type="text"
      placeholder="e.g., City Bus Stand"
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      value={driverRide.destination}
      onChange={(e) =>
        setDriverRide({ ...driverRide, destination: e.target.value })
      }
    />
  </div>

  {/* DATE & TIME */}
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      Departure Date &amp; Time
    </label>
    <input
      type="datetime-local"
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      value={driverRide.date}
      onChange={(e) =>
        setDriverRide({ ...driverRide, date: e.target.value })
      }
    />
  </div>

  {/* SEATS */}
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      Available Seats
    </label>
    <input
      type="number"
      min="1"
      max="6"
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      value={driverRide.seatsAvailable}
      onChange={(e) =>
        setDriverRide({
          ...driverRide,
          seatsAvailable: Number(e.target.value),
        })
      }
    />
  </div>

  {/* CAR MODEL (UI ONLY, OPTIONAL) */}
  {/* <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      Car Model
    </label>
    <select
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      disabled
    >
      <option>Sedan</option>
      <option>Hatchback</option>
      <option>SUV</option>
      <option>Other</option>
    </select>
  </div> */}
  {/* VEHICLE SELECT */}
<div>
  <label className="block text-xs font-medium text-slate-500 mb-1">
    Select Vehicle
  </label>

  <select
    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    value={driverRide.vehicleId}
    onChange={(e) =>
      setDriverRide({ ...driverRide, vehicleId: e.target.value })
    }
  >
    <option value="">Select your vehicle</option>

    {user?.vehicles?.map((v, i) => (
      <option key={i} value={i}>
        {v.vehicleType.toUpperCase()} - {v.vehicleName}
      </option>
    ))}
  </select>
</div>
</div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full py-2.5"
                >
                  Post Ride Now
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  This is a demo. On the backend this data would be stored and
                  shown to passengers searching for rides.
                </p>
              </form>
            </div>
          ) : (
            /* ---------- PASSENGER: SEARCH + MAP + DEMO RIDES ---------- */
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Find a carpool instantly
                  </h2>
                  <p className="text-sm text-slate-500">
                    Select pickup, drop, date and time to see a demo list of
                    rides and route on the map.
                  </p>
                </div>
              </div>

              {/* Search bar */}
              {/* Search bar */}
<div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-center">
  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 w-full">

    {/* FROM */}
    <div>
      <label className="block text-xs font-medium text-slate-500">
        From
      </label>
      <input
        type="text"
        placeholder="Enter pickup location"
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
        value={search.from}
        onChange={(e) =>
          setSearch({ ...search, from: e.target.value })
        }
      />
    </div>

    {/* TO */}
    <div>
      <label className="block text-xs font-medium text-slate-500">
        To
      </label>
      <input
        type="text"
        placeholder="Enter drop location"
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
        value={search.to}
        onChange={(e) =>
          setSearch({ ...search, to: e.target.value })
        }
      />
    </div>

    {/* DATE */}
    <div>
      <label className="block text-xs font-medium text-slate-500">
        Date
      </label>
      <input
        type="date"
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
        value={search.date}
        onChange={(e) =>
          setSearch({ ...search, date: e.target.value })
        }
      />
    </div>

    {/* TIME */}
    <div>
      <label className="block text-xs font-medium text-slate-500">
        Time
      </label>
      <input
        type="time"
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
        value={search.time}
        onChange={(e) =>
          setSearch({ ...search, time: e.target.value })
        }
      />
    </div>
  </div>
{/* ====-------====== */}

{/* {user?.role === "passenger" && user?.gender === "female" && (
  <label style={{ fontSize: "14px" }}>
    <input
      type="checkbox"
      checked={femaleOnly}
      onChange={(e) => setFemaleOnly(e.target.checked)}
    />
    {" "}Female drivers only
  </label>
)} */}

{user?.role === "passenger" && user?.gender === "female" && (
  <button
    type="button"
    onClick={() => setFemaleOnly(!femaleOnly)}
    className={`px-3 py-1 rounded-full border text-xs font-medium transition
      ${
        femaleOnly
          ? "bg-pink-50 text-pink-700 border-pink-300"
          : "bg-white text-slate-500 border-slate-300 hover:bg-slate-100"
      }`}
  >
    Female only
    <span
      className={`ml-2 inline-block h-2 w-2 rounded-full align-middle ${
        femaleOnly ? "bg-pink-600" : "bg-slate-300"
      }`}
    />
  </button>
)}

{/* ===---------====== */}
  <button
    className="w-full lg:w-auto px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
    onClick={handleSearch}
  >
    Search Rides
  </button>
</div>
  
              {/* Map + demo rides */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Map (Leaflet) */}
                <div className="relative z-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[320px]">
                  <div ref={mapContainerRef} className="w-full h-full z-0" />
                </div>

                {/* Demo rides list */}
                <div className="space-y-3">
  {!searched ? (
    <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-sm text-slate-500 bg-white">
      Use the search above to find rides.
    </div>
  ) : results.length === 0 ? (
    <div className="border border-rose-300 rounded-2xl p-4 text-sm text-rose-600 bg-rose-50">
      ❌ No rides available for this route & time.
    </div>
  ) : (
    results.map((ride) => (
      <div
        key={ride._id}
        className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-3 shadow-sm bg-white"
      >
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-slate-900">
            {ride.origin} → {ride.destination}
          </p>

          <p className="text-slate-500">
            Date & Time:{" "}
            <span className="font-medium">
              {new Date(ride.date).toLocaleString()}
            </span>
          </p>

          <p className="text-slate-500">
            Driver:{" "}
            <span className="font-medium">
              {ride.driver?.name || "Driver"}
            </span>
          </p>
          <p className="text-slate-500">
  Vehicle:{" "}
  <span className="font-medium">
    {/* {ride.vehicleType} - {ride.vehicleName} */}
    {ride.vehicleType} - {ride.vehicleName} ({ride.fuelType})
  </span>
</p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold text-indigo-600">
            ₹{ride.pricePerSeat}
          </p>

          {/* <button
            onClick={() => handleBookSeat(ride)}
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Book Seat
          </button> */}
          <button
  onClick={() => {
    setSelectedRide(ride);
    setShowPopup(true);
  }}
  className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition"
>
  Book Seat
</button>
        </div>
      </div>
    ))
  )}
</div>

              </div>
            </>
          )}
        </div>
      </section>
      

<BookingPopup
  isOpen={showPopup}
  user={user}
  maxSeats={selectedRide?.seatsAvailable}
  onClose={() => setShowPopup(false)}
  onConfirm={(passengers, seats) => {

    setShowPopup(false);

    navigate("/payment", {
      state: {
        rideId: selectedRide._id,
        seats,
        passengers,
        ride: selectedRide
      }
    });

  }}
/>




    </div>
  );
}
