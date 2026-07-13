// import { Link, NavLink } from "react-router-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LanguageModal from "./LanguageModal";

const navLinkClass =
  "text-sm font-medium px-3 py-2 rounded-full hover:bg-white/10 transition";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLang, setShowLang] = useState(false);

  // RideCoins Popup
const [showRideCoins, setShowRideCoins] = useState(false);

  const dashboardPath =
    user?.role === "passenger"
      ? "/passenger/dashboard"
      : user?.role === "driver"
      ? "/driver/dashboard"
      : user?.role === "admin"
      ? "/admin/dashboard"
      : "/";

  return (
    <>
      <header className="sticky top-0 z-50 bg-black text-white shadow-lg">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="font-semibold text-xl">RideShare</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-3">
            
            {/* 🌐 Language Button */}
            <button
              onClick={() => setShowLang(true)}
              className="text-sm px-3 py-2 rounded-full hover:bg-white/10"
            >
              🌐 EN
            </button>

            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink to={dashboardPath} className={navLinkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/community" className={navLinkClass}>
                  Community
                </NavLink>

{/* RideCoins */}
{/* <div className="relative"> */}
{user?.role === "passenger" && (
  <div className="relative">

  <button
    onClick={() => setShowRideCoins(!showRideCoins)}
    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition"
  >
    <span className="text-yellow-400 text-lg">🪙</span>

    <span className="font-semibold">
      {user?.rideCoins ?? 0}
    </span>
  </button>

  {showRideCoins && (
    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-black">

      {/* Arrow */}
      <div className="absolute -top-2 right-8 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">

        <div className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
            🪙
          </div>

          <h3 className="font-semibold text-lg">
            RideCoins
          </h3>

        </div>

        <button
          onClick={() => setShowRideCoins(false)}
          className="text-xl text-gray-500 hover:text-black"
        >
          ✕
        </button>

      </div>

      <div className="px-5 pb-4">

        <p className="text-sm text-gray-500">
          Current Balance
        </p>

        <p className="text-4xl font-bold text-indigo-600 mt-1">
          {user?.rideCoins ?? 0} RC
        </p>

      </div>

      <div className="border-t"></div>

      <div className="p-5">

        <button
  onClick={() => {
    setShowRideCoins(false);
    navigate("/ridecoins");
  }}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-semibold transition"
>
  View Rewards →
</button>

      </div>

    </div>
  )}

</div>
)}

                {/* <NavLink to="/notifications" className={navLinkClass}>
                  🔔
                </NavLink> */}
                <NavLink to="/notifications" className="text-lg px-3 py-2">
                  🔔
                </NavLink>

                <button
                  onClick={logout}
                  className="text-sm font-medium px-4 py-2 rounded-full bg-white text-indigo-600 hover:bg-slate-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-sm font-medium px-5 py-2 rounded-full bg-white text-purple-600"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* 🌍 Language Modal */}
      {showLang && <LanguageModal onClose={() => setShowLang(false)} />}

        
    </>
  );
};


export default Navbar;
