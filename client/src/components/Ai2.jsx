import React, { useState } from "react";
import ai from "../assets/ai.jpg";
import { useNavigate } from "react-router-dom";
import open from "../assets/open.mp3";

function Ai() {
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);

  const openingSound = new Audio(open);

  // 🔊 Speak Function
  function speak(message) {
    let utterence = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterence);
  }

  // 🎤 Speech Recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  if (!recognition) {
    console.log("Speech not supported");
  }

  // -----------------------------------------
  // 5. HELPER QUESTION & ANSWER RESPONSES
  // -----------------------------------------
  const helpResponses = [
    {
      q: ["how do i book a ride", "book a ride", "how to book ride"],
      a: "To book a ride, go to the home page, fill your pickup and destination, then click Search Ride.",
    },
    {
      q: ["how can i become a driver", "become a driver", "driver account"],
      a: "To become a driver, register as a driver and complete your profile with vehicle and license details.",
    },
    {
      q: ["what is rideshare", "what is ride share", "about rideshare"],
      a: "RideShare is a carpooling platform where passengers and drivers share rides to save fuel and travel cost.",
    },
    {
      q: ["how do i edit my profile", "edit profile", "change my details"],
      a: "To edit your profile, open your dashboard and go to the Profile section.",
    },
    {
      q: ["refund policy", "refund", "what is the refund policy"],
      a: "Refunds are processed if a driver cancels before the scheduled ride. Passenger cancellations may not be refunded.",
    },
  ];

  // -----------------------------------------
  // 🎤 MAIN VOICE COMMAND HANDLER
  // -----------------------------------------
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.trim().toLowerCase();
    console.log("Voice Command:", transcript);

    // 1️⃣ HOME
    if (transcript.includes("home")) {
      speak("Opening home page");
      navigate("/");
      return;
    }

    // 2️⃣ DASHBOARD
    if (transcript.includes("dashboard")) {
      speak("Opening dashboard");
      navigate("/passenger/dashboard");
      return;
    }

    // 3️⃣ LOGIN PAGE
    if (transcript.includes("login")) {
      speak("Opening login page");
      navigate("/login");
      return;
    }

    // 4️⃣ REGISTER PAGE
    if (transcript.includes("register") || transcript.includes("signup")) {
      speak("Opening register page");
      navigate("/register");
      return;
    }

    // 5️⃣ LOGOUT
    if (transcript.includes("logout") || transcript.includes("log out")) {
      speak("Logging you out");
      localStorage.clear();
      navigate("/login");
      return;
    }

    // 6️⃣ HELP Q&A
    for (let item of helpResponses) {
      if (item.q.some((q) => transcript.includes(q))) {
        speak(item.a);
        return;
      }
    }

    // 7️⃣ DEFAULT RESPONSE
    speak("Sorry, I did not understand the command");
  };

  recognition.onend = () => {
    setActiveAi(false);
  };

  // -----------------------------------------
  // ▶️ On Click → Greet + Start Listening
  // -----------------------------------------
  const startAi = () => {
    speak("Hello, my name is Rick. How can I help you?");
    openingSound.play();
    setActiveAi(true);

    setTimeout(() => {
      recognition.start();
    }, 1200);
  };

  // -----------------------------------------
  // UI RETURN
  // -----------------------------------------
  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"
      onClick={startAi}
    >
      <img
        src={ai}
        alt="AI Assistant"
        className={`w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer transition-transform ${
          activeAi
            ? "translate-x-[10%] translate-y-[-10%] scale-125"
            : "translate-x-0 translate-y-0 scale-100"
        }`}
        style={{
          filter: activeAi
            ? "drop-shadow(0px 0px 30px #00d2fc)"
            : "drop-shadow(0px 0px 20px black)",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export default Ai;
