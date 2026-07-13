import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatBot({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState("home");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  if (!isOpen) return null;

  const handleQuestion = (customQuestion = null) => {
    const userQuestion = customQuestion || question;

    if (!userQuestion.trim()) return;

    let answer =
      "Sorry, I couldn't answer your question.\n\n📞 Contact Customer Support\n📧 support@rideshare.com";

    const q = userQuestion.toLowerCase();

    if (q.includes("book")) {
      answer =
        "To book a ride, select Book Ride, enter pickup and destination, choose an available ride and complete payment.";
    } else if (q.includes("refund")) {
      answer =
        "Refunds are processed when drivers cancel rides. For payment-related issues, please contact support.";
    } else if (q.includes("payment")) {
      answer =
        "Payments are completed after selecting a ride and confirming passenger details.";
    } else if (q.includes("driver")) {
      answer =
        "You can become a driver by completing your driver profile and vehicle details.";
    } else if (q.includes("profile")) {
      answer =
        "You can edit your profile from your dashboard profile section.";
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userQuestion,
      },
      {
        type: "bot",
        text: answer,
      },
    ]);

    setQuestion("");
  };

  const suggestedQuestions = [
    "How do I book a ride?",
    "Refund policy",
    "Payment issue",
    "How can I become a driver?",
    "How do I edit my profile?",
  ];

  return (
    <div
      className="
      fixed
      left-[90px]
      bottom-[20px]
      z-[9999]
      w-[380px]
      h-[560px]
      bg-white/95
      backdrop-blur-lg
      rounded-2xl
      border
      border-slate-200
      shadow-2xl
      overflow-hidden
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

      {/* HOME SCREEN */}
      {currentPage === "home" && (
        <div className="p-5 h-full flex flex-col">
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

          <div className="space-y-3">
            <button
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

            <button
              onClick={() => setCurrentPage("support")}
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

          <div className="mt-auto pt-4">
            <div className="text-center text-xs text-slate-500 border-t pt-3">
              RideShare Assistant • Online
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT SCREEN */}
      {currentPage === "support" && (
        <div className="p-4 h-full flex flex-col">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-blue-600 text-sm mb-3"
          >
            ← Back
          </button>

          <h3 className="font-semibold text-lg mb-2">
            ❓ Query & Support
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            Ask me anything about RideShare.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQuestions.map((item) => (
              <button
                key={item}
                onClick={() => handleQuestion(item)}
                className="bg-slate-100 hover:bg-slate-200 text-xs px-3 py-2 rounded-full"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm">
                Select a suggested question or type your own.
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.type === "user"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[90%] ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Type your question..."
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={() => handleQuestion()}
              className="bg-blue-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>

          <button className="mt-3 text-red-600 text-sm">
            📞 Contact Customer Support
          </button>
        </div>
      )}
    </div>
  );
}