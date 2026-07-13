import React, { useState, useEffect } from "react";

export default function BookingPopup({ isOpen, onClose, onConfirm, user, maxSeats }) {

  const [bookingFor, setBookingFor] = useState("myself");
  const [seats, setSeats] = useState(1);
  const [passengers, setPassengers] = useState([]);

  // Reset when popup opens
  useEffect(() => {
    if (isOpen) {
      setSeats(1);
      setPassengers([
        {
          name: user?.name || "",
          phone: user?.phone || ""
        }
      ]);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle seat change
  const handleSeatsChange = (value) => {

    const num = Number(value);

    if (num < 1) return;

    if (num > maxSeats) {
      alert(`Only ${maxSeats} seats available`);
      return;
    }

    setSeats(num);

    const arr = [];

    for (let i = 0; i < num; i++) {
      arr.push({
        name: i === 0 && bookingFor === "myself" ? user.name : "",
        phone: i === 0 && bookingFor === "myself" ? user.phone || "" : "",
      });
    }

    setPassengers(arr);
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* <h2 style={{ marginBottom: "10px" }}>Book Ride</h2> */}
        <div style={{ marginBottom: "20px" }}>

  <h2
    style={{
      fontSize: "24px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "6px"
    }}
  >
    Confirm Your Booking
  </h2>

  <p
    style={{
      fontSize: "14px",
      color: "#6b7280",
      margin: 0
    }}
  >
    Please verify passenger information before proceeding.
  </p>

</div>

        {/* Booking For */}
        {/* <label>Who are you booking for?</label> */}
        <label
  style={{
    fontWeight: "600",
    color: "#374151"
  }}
>
  Booking For
</label>

        <select
          value={bookingFor}
          onChange={(e) => setBookingFor(e.target.value)}
          style={inputStyle}
        >
          <option value="myself">Myself</option>
          <option value="other">Someone Else</option>
        </select>

        {/* Seats */}
        {/* <label style={{ marginTop: "10px", display: "block" }}>
          Number of Seats (Max {maxSeats})
        </label> */}
        <label
  style={{
    display: "block",
    marginTop: "14px",
    fontWeight: "600",
    color: "#374151"
  }}
>
  Seats Required
</label>

        <input
          type="number"
          min="1"
          max={maxSeats}
          value={seats}
          onChange={(e) => handleSeatsChange(e.target.value)}
          style={inputStyle}
        />
<h3
  style={{
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827"
  }}
>
  Passenger Details
</h3>
        {/* Passenger Inputs */}
        {passengers.map((p, i) => (
          // <div key={i} style={{ marginTop: "10px" }}>
          <div
  key={i}
  style={{
    marginTop: "10px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px"
  }}
>

            {/* <input
              // placeholder={`Passenger ${i + 1} Name`}
              placeholder="Full Name"
              value={p.name} */}
              <label
  style={{
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px"
  }}
>
  Full Name
</label>

<input
  placeholder="Enter full name"
  value={p.name}
              onChange={(e) =>
                updatePassenger(i, "name", e.target.value)
              }
              style={inputStyle}
            />

            {/* <input
              // placeholder={`Passenger ${i + 1} Phone`}
              placeholder="Mobile Number"
              value={p.phone} */}
              <label
  style={{
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "10px",
    marginBottom: "4px"
  }}
>
  Mobile Number
</label>

<input
  placeholder="Enter mobile number"
  value={p.phone}
              onChange={(e) =>
                updatePassenger(i, "phone", e.target.value)
              }
              style={inputStyle}
            />

          </div>
        ))}

{/* <div
  style={{
    marginTop: "18px",
    padding: "14px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb"
  }}
>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px"
    }}
  >
    <span>Seats Booked</span>
    <strong>{seats}</strong>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between"
    }}
  >
    <span>Estimated Fare</span>
    <strong>₹80</strong>
  </div>

</div> */}

        {/* Buttons */}
        {/* <div style={{ marginTop: "20px" }}> */}
     <div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  }}
>
 <button
            style={cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={confirmBtn}
            onClick={() => {

              if (seats > maxSeats) {
                alert(`Only ${maxSeats} seats available`);
                return;
              }

              onConfirm(passengers, seats);

            }}
          >
            Proceed
          </button>

          {/* <button
            style={cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button> */}

        </div>

      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

// const modalStyle = {
//   background: "#fff",
//   padding: "30px",
//   borderRadius: "14px",
//   width: "380px",
//   textAlign: "center",
//   boxShadow: "0 10px 40px rgba(0,0,0,0.25)"
// };
// const modalStyle = {
//   background: "#fff",
//   padding: "28px",
//   borderRadius: "16px",
//   width: "460px",
//   boxShadow: "0 20px 60px rgba(0,0,0,0.18)"
// };
const modalStyle = {
  background: "#fff",
  padding: "28px",
  borderRadius: "16px",
  width: "460px",

  height: "620px",      // Fixed height
  overflowY: "auto",    // Scroll inside popup

  boxShadow: "0 20px 60px rgba(0,0,0,0.18)"
};

// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   marginTop: "6px",
//   borderRadius: "6px",
//   border: "1px solid #ddd"
// };
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none"
};

const confirmBtn = {
  flex: 1,
  background: "#4f46e5",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
};

const cancelBtn = {
  flex: 1,
  background: "#e5e7eb",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
};