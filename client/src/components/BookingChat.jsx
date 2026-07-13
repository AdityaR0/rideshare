// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import BookingPopup from "./BookingPopup";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { HiMiniMicrophone } from "react-icons/hi2";

export default function BookingChat({ onBack, onClose }) {
    const navigate = useNavigate();
    const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Hi! I'm your RideShare Booking Assistant.\n\nWhere are you travelling from?"
    }
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState("origin");
  const [bookingData, setBookingData] = useState({
  origin: "",
  destination: "",
  date: "",
  time: "",
  seats: 1,
});
const [rides, setRides] = useState([]);

const [selectedRide, setSelectedRide] = useState(null);
const [showPopup, setShowPopup] = useState(false);

const bottomRef = useRef(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, rides]);

const isValidLocation = (value) => {

  const text = value.trim();

  if (text.length < 3) return false;

  return /^[A-Za-z ]+$/.test(text);

};

const isValidDate = (value) => {

  const text = value.trim().toLowerCase();

  // Today / Tomorrow

  if (text === "today" || text === "tomorrow") {

    return true;

  }

  // DD/MM/YYYY

  const pattern = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

  return pattern.test(text);

};

const isValidTime = (value) => {

  const text = value.trim().toLowerCase();

  // 15:30
  const time24 = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  // 3 PM / 3PM
  const time12 = /^(0?[1-9]|1[0-2])\s?(am|pm)$/i;

  return time24.test(text) || time12.test(text);

};

const isValidSeats = (value) => {

  const seats = Number(value);

  if (!Number.isInteger(seats)) {

    return false;

  }

  if (seats < 1) {

    return false;

  }

  if (seats > 6) {

    return false;

  }

  return true;

};

const getIntent = (text) => {

  const msg = text.toLowerCase().trim();

  // Greetings
  const greetings = [
    "hi",
    "hii",
    "hiii",
    "hello",
    "helloo",
    "hey",
    "heyy",
    "good morning",
    "good afternoon",
    "good evening",
    "good night"
  ];

  if (greetings.includes(msg)) {
    return "greeting";
  }

  // Booking
  if (
    msg.includes("book") ||
    msg.includes("ride") ||
    msg.includes("booking") ||
    msg.includes("travel")
  ) {
    return "book";
  }

  // Help
  if (
    msg.includes("help") ||
    msg.includes("support")
  ) {
    return "help";
  }

  // Cancel
  if (
    msg === "cancel" ||
    msg === "exit"
  ) {
    return "cancel";
  }

  return null;
};

const sendMessage = () => {

  if (!input.trim()) return;

  const userAnswer = input.trim();
  const intent = getIntent(userAnswer);

  // Greeting works from anywhere

if (intent === "greeting") {

  setMessages(prev => [

    ...prev,

    {

      sender: "bot",

      text:
`👋 Hello!

I'm your RideShare Booking Assistant.

Please continue your booking.`

    }

  ]);

  setInput("");

  return;

}

  if (step === "origin" && intent === "greeting") {

  setMessages(prev => [

    ...prev,

    {

      sender: "bot",

      text:
`👋 Hello!

I'm your RideShare Booking Assistant.

Let's book your ride.

📍 Where are you travelling from?`

    }

  ]);

  setInput("");

  return;

}

if (step === "origin" && intent === "book") {

  setMessages(prev => [

    ...prev,

    {

      sender: "bot",

      text:
`🚗 Sure!

Let's book your ride.

📍 Where are you travelling from?`

    }

  ]);

  setInput("");

  return;

}

  // Show user message
  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userAnswer,
    },
  ]);

// =========================
// ORIGIN
// =========================

if (step === "origin") {

  if (!isValidLocation(userAnswer)) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
          "❌ Please enter a valid pickup location.\n\nExample:\nHowrah\nSalt Lake\nAirport"

      }

    ]);

    setInput("");

    return;

  }

  setBookingData(prev => ({

    ...prev,

    origin: userAnswer

  }));

  setTimeout(() => {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text: "📍 Great! Where do you want to go?"

      }

    ]);

  },500);

  setStep("destination");

}

// =========================
// DESTINATION
// =========================

else if (step === "destination") {

  // Check destination

  if (!isValidLocation(userAnswer)) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
`❌ Please enter a valid destination.

Example:

Kolkata
Airport
Salt Lake`

      }

    ]);

    setInput("");

    return;

  }

  // Save destination

  setBookingData(prev => ({

    ...prev,

    destination: userAnswer

  }));

  // Ask date

  setTimeout(() => {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text: "📅 When do you want to travel?\n\nExample:\n11/07/2026"

      }

    ]);

  },500);

  setStep("date");

}
// =========================
// DATE
// =========================

else if (step === "date") {

  if (!isValidDate(userAnswer)) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
`❌ Invalid date.

Please enter date like

11/07/2026

or

Today

or

Tomorrow`

      }

    ]);

    setInput("");

    return;

  }

  setBookingData(prev => ({

    ...prev,

    date: userAnswer

  }));

  setTimeout(() => {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
"🕒 What time do you want to travel?\n\nExample:\n15:30"

      }

    ]);

  },500);

  setStep("time");

}

// =========================
// TIME
// =========================

else if (step === "time") {

  if (!isValidTime(userAnswer)) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
`❌ Invalid time.

Examples:

15:30

09:45

3 PM

7 AM`

      }

    ]);

    setInput("");

    return;

  }

  setBookingData(prev => ({

    ...prev,

    time: userAnswer

  }));

  setTimeout(() => {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
"👥 How many seats do you want to book?"

      }

    ]);

  },500);

  setStep("seats");

}

// =========================
// SEATS
// =========================

else if (step === "seats") {

  if (!isValidSeats(userAnswer)) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
`❌ Invalid number of seats.

Please enter a number between

1 and 6.`

      }

    ]);

    setInput("");

    return;

  }

  const finalBooking = {

    ...bookingData,

    seats: Number(userAnswer),

  };

  setBookingData(finalBooking);

  setTimeout(async () => {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
`📋 Booking Summary

📍 From: ${finalBooking.origin}

📍 To: ${finalBooking.destination}

📅 Date: ${finalBooking.date}

🕒 Time: ${finalBooking.time}

👥 Seats: ${finalBooking.seats}

🔍 Searching for the best rides...`

      }

    ]);

    await searchRides(finalBooking);

  },500);

  setStep("results");

}


// =========================
// RESULTS
// =========================

else if (step === "results") {

  const msg = userAnswer.toLowerCase();

  if (msg.includes("change date")) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text: "📅 Enter your new travel date."

      }

    ]);

    setStep("date");

  }

  else if (msg.includes("change pickup")) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text: "📍 Enter your new pickup location."

      }

    ]);

    setStep("origin");

  }

  else if (msg.includes("change destination")) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text: "📍 Enter your new destination."

      }

    ]);

    setStep("destination");

  }

  else if (msg.includes("change seats")) {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text: "👥 Enter number of seats."

      }

    ]);

    setStep("seats");

  }

  else {

    setMessages(prev => [

      ...prev,

      {

        sender: "bot",

        text:
`I didn't understand.

You can type:

• Change Date

• Change Pickup

• Change Destination

• Change Seats`

      }

    ]);

  }

}


  setInput("");

};
const searchRides = async (booking) => {

  try {

    const res = await api.get("/rides");

    const allRides = res.data;
    console.log("ALL RIDES", allRides);

const filteredRides = allRides.filter((ride) => {

  return (

    ride.origin
      .toLowerCase()
      .includes(booking.origin.toLowerCase()) &&

    ride.destination
      .toLowerCase()
      .includes(booking.destination.toLowerCase()) &&

    ride.seatsAvailable >= booking.seats

  );

});
    setRides(filteredRides);
    console.log("FILTERED", filteredRides);

    if (filteredRides.length === 0) {

    setMessages((prev) => [

        ...prev,

        {

            sender: "bot",

            text:
`😔 No rides found.

You can:

• Try another date
• Change pickup or destination
• Wait for a driver to post a ride`

        }

    ]);

}

    setMessages((prev) => [

    ...prev,

    {

        sender: "bot",

        text: `✅ Found ${filteredRides.length} matching ride(s). Please choose one below.`

    }

]);

    console.log(filteredRides);

  } catch (err) {

    console.error(err);

  }

};

  return (

    <div className="h-[calc(100%-72px)] flex flex-col">

      {/* Top */}

      <div className="border-b p-3">

        <button
          onClick={onBack}
          className="text-blue-600 font-medium"
        >
          ← Back
        </button>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[75%] p-3 rounded-2xl whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              {msg.text}
            </div>

          </div>

        ))}

        {rides.length > 0 && (

  <div className="mt-6">

    <h3 className="font-semibold text-lg mb-3">
      🚗 Available Rides
    </h3>

    <div className="space-y-3">

      {rides.map((ride) => (

        <div
          key={ride._id}
          className="border rounded-xl p-4 bg-white shadow"
        >

          <p>
            <b>Driver:</b> {ride.driver.name}
          </p>

          <p>
            <b>Route:</b> {ride.origin} → {ride.destination}
          </p>

          <p>
            <b>Date:</b>{" "}
            {new Date(ride.date).toLocaleString()}
          </p>

          <p>
            <b>Price:</b> ₹{ride.pricePerSeat}
          </p>

          <p>
            <b>Seats Left:</b> {ride.seatsAvailable}
          </p>

<button
onClick={() => {

    setSelectedRide(ride);

    // 1 Passenger
   if (bookingData.seats === 1) {

    onClose();

    navigate("/payment", {

            state: {

                rideId: ride._id,

                ride,

                seats: 1,

                passengers: [

                    {

                        name: user.name,

                        phone: user.phone,

                    }

                ]

            }

        });

    }

    // More than 1 Passenger
    else {

        setShowPopup(true);

    }

}}
className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
>

Book Now

</button>

        </div>

      ))}

    </div>

  </div>

)}
<div ref={bottomRef}></div>

      </div>
      

      {/* Bottom */}

      <div className="border-t p-3 flex gap-2">

  <input
    disabled={step === "completed"}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    }}
    placeholder="Type here..."
    className="flex-1 border rounded-full px-4 py-3"
  />

  <button
    onClick={() => alert("🎤 Voice Booking Coming Soon")}
    className="w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
  >
    <HiMiniMicrophone className="text-gray-700 text-xl" />
  </button>

  <button
    disabled={step === "completed"}
    onClick={sendMessage}
    className="bg-blue-600 text-white px-5 rounded-full"
  >
    Send
  </button>

</div>

      <BookingPopup
    isOpen={showPopup}
    user={user}
    maxSeats={selectedRide?.seatsAvailable}
    onClose={() => setShowPopup(false)}
    onConfirm={(passengers, seats) => {

    setShowPopup(false);

    onClose();

    navigate("/payment", {

            state: {

                rideId: selectedRide._id,

                ride: selectedRide,

                passengers,

                seats

            }

        });

    }}
/>

    </div>

  );

}