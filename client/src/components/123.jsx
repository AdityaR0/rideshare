import { useNavigate } from "react-router-dom";

export default function ChatBot({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

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

        {/* Footer */}
        <div className="mt-auto pt-4">
          <div className="text-center text-xs text-slate-500 border-t pt-3">
            RideShare Assistant • Online
          </div>
        </div>
      </div>
    </div>
  );
}