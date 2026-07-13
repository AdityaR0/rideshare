import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import BookingChat from "./BookingChat";
import api from "../utils/axios";

export default function ChatBot({ isOpen, onClose }) {
  const navigate = useNavigate();
const [screen, setScreen] = useState("home");
const [message, setMessage] = useState("");
const [showSuggestions, setShowSuggestions] = useState(true);
const bottomRef = useRef(null);
const [unknownCount, setUnknownCount] = useState(0);
const handleSOS = async () => {
  try {
    const res = await api.post("/sos/trigger");

    if (res.data.success) {
      alert("✅ SOS alert sent successfully.");
    } else {
      alert(res.data.message);
    }

  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to send SOS."
    );
  }
};

const [messages, setMessages] = useState([
  {
    sender: "bot",
    text: "👋 Welcome to RideShare Support. How can I help you today?"
  },
]);

 const faqAnswers = {
  "book ride":
    "To book a ride, enter pickup and destination locations and select an available ride.",

  "book a ride":
    "To book a ride, enter pickup and destination locations and select an available ride.",

  "booking confirmation":
    "Booking confirmation is sent immediately after successful booking.",

  "booking confirmed":
    "Booking confirmation is sent immediately after successful booking.",

  "seat availability":
    "Available seats are shown before you confirm your booking.",

  "available seats":
    "Available seats are shown before you confirm your booking.",

  "cancel ride":
    "You can cancel your booking from the My Bookings section before the ride starts.",

  "cancel booking":
    "You can cancel your booking from the My Bookings section before the ride starts.",

  "cancellation process":
    "Open My Bookings, select the ride and click Cancel Ride.",

  "how to cancel":
    "Open My Bookings, select the ride and click Cancel Ride.",

  "payment issue":
    "If payment was deducted but booking failed, please contact support.",

  "payment problem":
    "If payment was deducted but booking failed, please contact support.",

  "payment failed":
    "Please try again or use a different payment method.",

  "payment not working":
    "Please try again or use a different payment method.",

  "payment deducted":
    "If money was deducted and booking failed, the amount will be refunded automatically.",

  "money deducted":
    "If money was deducted and booking failed, the amount will be refunded automatically.",

  "refund":
    "Refunds are generally processed within 5-7 business days.",

  "money back":
    "Refunds are generally processed within 5-7 business days.",

  "refund status":
    "You can check refund status in your booking details section.",

  "refund update":
    "You can check refund status in your booking details section.",

  "driver complaint":
    "Please provide ride details and we will investigate the issue.",

  "bad driver":
    "Please provide ride details and we will investigate the issue.",

  "driver late":
    "Drivers may be delayed due to traffic. Please wait a few minutes or contact the driver.",

  "driver delayed":
    "Drivers may be delayed due to traffic. Please wait a few minutes or contact the driver.",

  "driver not arrived":
    "Please contact the driver through the ride details page.",

  "driver not come":
    "Please contact the driver through the ride details page.",

  "login issue":
    "Check your email and password or use Forgot Password.",

  "cannot login":
    "Check your email and password or use Forgot Password.",

  "forgot password":
    "Use the Forgot Password option on the login page.",

  "reset password":
    "Use the Forgot Password option on the login page.",

  "ride history":
    "You can view all completed rides in the My Rides section.",

  "previous rides":
    "You can view all completed rides in the My Rides section.",

  "ride delayed":
    "Ride updates will be shown in your booking details page.",

  "ride late":
    "Ride updates will be shown in your booking details page.",

  "change pickup":
    "Pickup location can be modified before booking confirmation.",

  "change pickup location":
    "Pickup location can be modified before booking confirmation.",

  "change destination":
    "Destination changes may require driver approval.",

  "change drop":
    "Destination changes may require driver approval.",

  "sos":
    "Use the SOS button during a ride for emergency assistance.",

  "emergency":
    "Use the SOS button during a ride for emergency assistance.",

  "become driver":
    "You can register through the Driver Registration page.",

  "join driver":
    "You can register through the Driver Registration page.",

  "driver verification":
    "Verification usually takes 24-48 hours.",

  "verify driver":
    "Verification usually takes 24-48 hours.",

  "fare":
    "Ride fare is calculated based on distance and route.",

  "ride price":
    "Ride fare is calculated based on distance and route.",

"customer":
"A customer support representative will contact you within 15 minutes.",

"customer support":
"A customer support representative will contact you within 15 minutes.",

"call me":
"A customer support representative will contact you within 15 minutes.",

"call":
"A customer support representative will contact you within 15 minutes.",

"contact support":
"A customer support representative will contact you within 15 minutes.",

"email":
"You can reach us at support@rideshare.com.",

"support email":
"You can reach us at support@rideshare.com.",

"phone":
"You can contact us at +91-XXXXXXXXXX.",

"phone number":
"You can contact us at +91-XXXXXXXXXX."
};

const sendMessage = (customQuestion = null) => {
  const userText = customQuestion || message;

  if (!userText.trim()) return;
  setShowSuggestions(false);

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userText,
    },
  ]);

  const normalized = userText.toLowerCase();

//   let botReply =
//   "Sorry, I couldn't understand your query.\n\nPlease contact customer support for further assistance.";
let botReply = null;

  Object.keys(faqAnswers).forEach((key) => {
    if (normalized.includes(key)) {
      botReply = faqAnswers[key];
    }
  });

  if (botReply) {
  setUnknownCount(0);
} else {
  const newCount = unknownCount + 1;

  setUnknownCount(newCount);

  if (newCount < 3) {
    botReply =
      "I'm not sure I understood that.\n\nCould you explain a little more?";
  } else {
    botReply =
      "I'm having trouble understanding your request.\n\nWould you like me to:\n📞 Connect to customer support\n📧 Get support email\n☎️ Get support phone number";
  }
}

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: botReply,
      },
    ]);
  }, 500);

  setMessage("");
};

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  if (!isOpen) return null;

  return (
    <div
      className="
      fixed
      left-[90px]
      bottom-[20px]
      z-[9999]
      w-[380px]
      h-[580px]
      bg-white/95
      backdrop-blur-lg
      rounded-2xl
      border
      border-slate-200
      shadow-2xl
      overflow-hidden
      animate-[fadeIn_.25s_ease-out]
    "
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">
            🤖 RideShare Assistant
          </h2>

          <p className="text-xs opacity-90">
            ● Online
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-xl hover:scale-110 transition"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      {/* <div className="p-5 h-full flex flex-col"> */}
      {screen === "home" && (
        <div className="p-5 h-full flex flex-col">
        {/* Welcome */}
        <div className="bg-slate-100 rounded-xl p-4 mb-5">
          <h3 className="font-semibold text-lg mb-2">
            👋 Welcome to RideShare
          </h3>

          <p className="text-sm text-slate-600">
            I'm here to help you find rides,
            manage bookings and answer your
            questions.
          </p>

          <p className="mt-3 font-medium">
            How can I help you today?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">

          <button
  onClick={() => setScreen("booking")}
  className="
    w-full
    text-left
    p-4
    rounded-xl
    bg-blue-50
    hover:bg-blue-100
    transition
    border
  "
>
  🚗 Book Ride
</button>

          {/* <button
            className="
            w-full
            text-left
            p-4
            rounded-xl
            bg-purple-50
            hover:bg-purple-100
            transition
            border
            "
          >
            ❓ Query & Support
          </button> */}
          <button
  onClick={() => setScreen("support")}
  className="
  w-full
  text-left
  p-4
  rounded-xl
  bg-purple-50
  hover:bg-purple-100
  transition
  border
  "
>
  ❓ Query & Support
</button>

          <button
            onClick={() =>
              navigate("/passenger/my-rides")
            }
            className="
            w-full
            text-left
            p-4
            rounded-xl
            bg-green-50
            hover:bg-green-100
            transition
            border
            "
          >
            📋 My Bookings
          </button>

          <button
  onClick={handleSOS}
  className="
  w-full
  text-left
  p-4
  rounded-xl
  bg-red-50
  hover:bg-red-100
  transition
  border
  "
>
  🆘 Emergency Help
</button>

        </div>

        {/* Footer */}
        <div className="mt-auto pt-4">
          <div className="text-center text-xs text-slate-500 border-t pt-3">
            RideShare Assistant • Online
          </div>
        </div>
      </div>
      )}
      {screen === "support" && (
//   <div className="h-full flex flex-col">
<div className="h-[calc(100%-72px)] flex flex-col">
    
    <div className="px-4 py-2 border-b">
  <button
    onClick={() => setScreen("home")}
    className="text-blue-600 text-sm font-medium"
  >
    ← Back
  </button>
</div>

    {/* <div className="flex-1 p-4 overflow-y-auto"> */}
    {/* <div className="flex-1 p-4 overflow-y-auto min-h-0"> */}
    <div className="flex-1 overflow-y-auto p-4">

        <div className="space-y-3 mb-4">
  {messages.map((msg, index) => (
  <div
    key={index}
    className={`flex mb-3 ${
      msg.sender === "user"
        ? "justify-end"
        : "justify-start"
    }`}
  >
    {msg.sender === "bot" && (
      <div className="mr-2 text-xl">
        🤖
      </div>
    )}

    {/* <div
      className={`max-w-[75%] p-3 rounded-2xl text-sm ${
        msg.sender === "user"
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-gray-800"
      }`}
    >
      {msg.text}
    </div> */}
    <div
  className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line ${
    msg.sender === "user"
      ? "bg-blue-600 text-white"
      : "bg-slate-100 text-gray-800"
  }`}
>
  {msg.text}
</div>
  </div>
))}

  <div ref={bottomRef}></div>

</div>

      {/* <div className="flex flex-wrap gap-2 mb-4"> */}
      {showSuggestions && (
<div className="flex flex-wrap gap-2 mb-4">
<p className="text-xs text-slate-500 mb-2">
  Quick Questions
</p>
<button
  onClick={() => sendMessage("Cancellation Process")}
//   className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-slate-200"
className="
px-3
py-2
text-xs
font-medium
rounded-full
border
border-slate-300
bg-white
hover:bg-blue-50
hover:border-blue-400
transition
truncate
"
>
  ❌ Cancellation Process
</button>

<button
  onClick={() => sendMessage("Payment Issue")}
 className="
px-3
py-2
text-xs
font-medium
rounded-full
border
border-slate-300
bg-white
hover:bg-blue-50
hover:border-blue-400
transition
truncate
"
>
  💳 Payment Issue
</button>

<button
  onClick={() => sendMessage("Refund Status")}
  className="
px-3
py-2
text-xs
font-medium
rounded-full
border
border-slate-300
bg-white
hover:bg-blue-50
hover:border-blue-400
transition
truncate
"
>
  🔄 Refund Status
</button>

<button
  onClick={() => sendMessage("Driver Complaint")}
  className="
px-3
py-2
text-xs
font-medium
rounded-full
border
border-slate-300
bg-white
hover:bg-blue-50
hover:border-blue-400
transition
truncate
"
>
  🚨 Driver Complaint
</button>

<button
  onClick={() => sendMessage("Contact Support")}
  className="
px-3
py-2
text-xs
font-medium
rounded-full
border
border-slate-300
bg-white
hover:bg-blue-50
hover:border-blue-400
transition
truncate
"
>
  📞 Contact Support
</button>

      </div>
)}

    </div>

    {/* <div className="border-t p-3"> */}
    {/* <div className="border-t p-3 bg-red-100"> */}
    <div className="border-t p-3">

      <div className="flex gap-2">

        <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
  placeholder="Ask a question..."
  className="
  flex-1
  border
  border-slate-300
  rounded-full
  px-4
  py-3
  outline-none
  focus:ring-2
  focus:ring-blue-500
  "
/>

<button
  onClick={() => sendMessage()}
  className="
  bg-blue-600
  hover:bg-blue-700
  text-white
  px-5
  py-3
  rounded-full
  transition
  "
>
  Send
</button>

      </div>

      <button
  onClick={() => {
    setMessages([
  {
    sender: "bot",
    text: "👋 Welcome to RideShare Support. How can I help you today?"
  },
]);

setShowSuggestions(true);
setMessage("");
setUnknownCount(0);
setScreen("home");
  }}
  className="
  w-full
  mt-3
  text-sm
  text-red-500
  hover:text-red-600
  "
>
  End Chat
</button>
    </div>

  </div>
)}
{screen === "booking" && (
  <BookingChat
    onBack={() => setScreen("home")}
    onClose={onClose}
  />
)}
    </div>
  );
}