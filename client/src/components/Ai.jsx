import { useState } from "react";
import ChatBot from "./ChatBot";
import ai from "../assets/ai.jpg";

export default function Ai() {
  const [open, setOpen] = useState(false);

  // return (
  //   <>
  //     {/* Floating AI Button */}
  //     <div
  //       className="fixed left-[2%] bottom-[20px] z-[9999]"
  //       onClick={() => setOpen(!open)}
  //     >
  return (
  <>
    {!open && (
      <div
        className="fixed left-[2%] bottom-[20px] z-[9999]"
        onClick={() => setOpen(true)}
      >
        <img
          src={ai}
          alt="RideShare Assistant"
          className={`w-[55px] h-[55px] rounded-full cursor-pointer object-cover transition-all duration-300 hover:scale-110 ${
            open ? "scale-110" : "scale-100"
          }`}
          style={{
            filter: open
              ? "drop-shadow(0px 0px 25px #3b82f6)"
              : "drop-shadow(0px 0px 15px black)",
          }}
        />
            </div>
    )}

      {/* Chat Window */}
      <ChatBot isOpen={open} onClose={() => setOpen(false)} />
    </> 
  );
}
