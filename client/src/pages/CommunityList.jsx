// src/pages/CommunityList.jsx
// import { useState } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CommunityList() {
  const navigate = useNavigate();
  const [showVerify, setShowVerify] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  
  const [officialEmail, setOfficialEmail] = useState("");
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
  
//   useEffect(() => {
//   api.get("/community/my")
//     .then((res) => {
//       setUserCommunity(res.data.community || "");
//     })
//     .catch((err) => console.error(err));
// }, []);

useEffect(() => {
  api.get("/community/my")
    .then((res) => {
      setUserCommunity(res.data.community || "");

      setOfficialCommunities(
        res.data.officialCommunities || []
      );
    })
    .catch((err) => console.error(err));
}, []);

  const [userCommunity, setUserCommunity] = useState("");
  const [officialCommunities, setOfficialCommunities] = useState([]);

  const hasJoinedTMSL = officialCommunities.some(
  (c) => c.communityName === "tmsl"
);

const hasJoinedInfosys = officialCommunities.some(
  (c) => c.communityName === "infosys"
);

  // const handleJoin = (type, name) => {
  //   if (type === "local") {
  //     navigate("/community/local");
  //   } else {
  //     setSelectedCommunity(name);
  //     setShowVerify(true);
  //   }
  // };
  const handleJoin = async (type, name) => {
  if (type === "local") {
    try {
      // await api.post("/community/join-local");
      // navigate("/community/local");
      await api.post("/community/join-local");
setUserCommunity("local"); // 🔥 THIS IS IMPORTANT
navigate("/community/local");
    } catch (err) {
      console.error(err);
      alert("Join failed");
    }
  } else {
    setSelectedCommunity(name);
    setShowVerify(true);
  }
};

const handleSendOTP = async () => {
  try {
    await api.post("/community/send-otp", {
      email: officialEmail,
      communityName:
        selectedCommunity === "Techno Main Salt Lake"
          ? "tmsl"
          : "infosys",
    });

    setOtpSent(true);

    alert("OTP sent successfully");
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to send OTP"
    );
  }
};

const handleVerifyOTP = async () => {
  try {
    await api.post("/community/verify-otp", {
      email: officialEmail,
      otp,
      communityName:
        selectedCommunity === "Techno Main Salt Lake"
          ? "tmsl"
          : "infosys",
    });

    alert("Community joined successfully");

    setShowVerify(false);
    setOfficialEmail("");
    setOtp("");
    setOtpSent(false);
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Verification failed"
    );
  }
};

  return (
    // <div className="bg-slate-50 min-h-screen py-10">
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4">

        <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">
          Community
        </p>
        {/* <h1 className="text-2xl font-bold text-slate-900 mt-1"> */}
        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          Choose Your Community
        </h1>
        {/* <p className="text-sm text-slate-600 mb-6"> */}
        <p className="text-sm text-slate-500 mb-8 max-w-xl">
          Join college, company or local communities
        </p>

        {/* <div className="grid sm:grid-cols-2 gap-6"> */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* COLLEGE */}
          {/* <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Techno Main Salt Lake</h3>
            <p className="text-sm text-slate-500">
              College community (email verification required)
            </p>
            <button
              onClick={() => handleJoin("college", "Techno Main Salt Lake")}
              className="mt-4 px-4 py-2 rounded-full bg-slate-900 text-white text-sm"
            >
              Join Community
            </button>
          </div> */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-slate-100">

  <div className="flex items-center gap-3 mb-3">
    <div className="text-3xl">🏫</div>
    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
      College Community
    </span>
  </div>

  <h3 className="font-semibold text-lg">Techno Main Salt Lake</h3>

  <p className="text-sm text-slate-500 mt-1">
    College community (email verification required)
  </p>

  <p className="text-xs text-slate-400 mt-2">
    Verified students only
  </p>

  {/* <button
    onClick={() => handleJoin("college", "Techno Main Salt Lake")}
    className="mt-4 w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm hover:bg-black transition"
  >
    Join Community 🔒
  </button> */}

  {hasJoinedTMSL ? (
  <button
    onClick={() => navigate("/community/tmsl")}
    className="mt-4 w-full px-4 py-2 rounded-full bg-green-600 text-white text-sm"
  >
    Go To Community →
  </button>
) : (
  <button
    onClick={() => handleJoin("college", "Techno Main Salt Lake")}
    className="mt-4 w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm hover:bg-black transition"
  >
    Join Community 🔒
  </button>
)}
</div>

          {/* COMPANY */}
          {/* <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Infosys</h3>
            <p className="text-sm text-slate-500">
              Company community (official email required)
            </p>
            <button
              onClick={() => handleJoin("company", "Infosys")}
              className="mt-4 px-4 py-2 rounded-full bg-slate-900 text-white text-sm"
            >
              Join Community
            </button>
          </div> */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-slate-100">

  <div className="flex items-center gap-3 mb-3">
    <div className="text-3xl">🏢</div>
    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
      Corporate Community
    </span>
  </div>

  <h3 className="font-semibold text-lg">Infosys</h3>

  <p className="text-sm text-slate-500 mt-1">
    Corporate community (official email required)
  </p>

  <p className="text-xs text-slate-400 mt-2">
    Official employees only
  </p>

  {hasJoinedInfosys ? (
  <button
    onClick={() => navigate("/community/infosys")}
    className="mt-4 w-full px-4 py-2 rounded-full bg-green-600 text-white text-sm"
  >
    Go To Community →
  </button>
) : (
  <button
    onClick={() => handleJoin("company", "Infosys")}
    className="mt-4 w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm hover:bg-black transition"
  >
    Join Community 🔒
  </button>
)}
</div>

          {/* LOCAL */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-slate-100">

  <div className="flex items-center gap-3 mb-3">
    <div className="text-3xl">📍</div>
    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
      Local Open Community
    </span>
  </div>

  <h3 className="font-semibold text-lg">Salt Lake Local</h3>

  <p className="text-sm text-slate-500 mt-1">
    Open local carpool community
  </p>

  <p className="text-xs text-slate-400 mt-2">
    Verified local residents & commuters
  </p>

  {userCommunity === "local" ? (
    <button
      onClick={() => navigate("/community/local")}
      className="mt-4 w-full px-4 py-2 rounded-full bg-green-600 text-white text-sm hover:bg-green-700 transition"
    >
      Go to Community →
    </button>
  ) : (
    <button
      onClick={() => handleJoin("local")}
      className="mt-4 w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm hover:bg-black transition"
    >
      Join Community
    </button>
  )}
</div>
        </div>

        {/* INFO */}
        {/* <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-700"> */}
        <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 flex items-center gap-2">
          🔒 College and Company communities are protected through official email verification to ensure trusted members only.
        </div>
      </div>

      {/* EMAIL VERIFY POPUP (DEMO) */}
      {showVerify && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[360px]">
            <h2 className="text-lg font-semibold mb-2">
              Verify Email
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Enter official email to join {selectedCommunity}
            </p>

            {/* <input
              type="email"
              placeholder="your-email@college/company.com"
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            /> */}
            <input
  type="email"
  value={officialEmail}
  onChange={(e) =>
    setOfficialEmail(e.target.value)
  }
  placeholder="your-email@college/company.com"
  className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
/>

{otpSent && (
  <input
    type="text"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    placeholder="Enter OTP"
    className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
  />
)}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowVerify(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              {/* <button
                onClick={() => setShowVerify(false)}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
              >
                Verify Email
              </button> */}

{!otpSent ? (
  <button
    onClick={handleSendOTP}
    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
  >
    Send OTP
  </button>
) : (
  <button
    onClick={handleVerifyOTP}
    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg"
  >
    Verify OTP
  </button>
)}

            </div>

            <p className="text-xs text-slate-400 mt-3">
              <p className="text-xs text-slate-500 mt-3">
  <p className="text-xs text-slate-500 mt-3">
  Official email verification is required for secure community access.
</p>
</p>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
