import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function CompleteProfile() {
  const { user, refreshProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDriver = user?.role === "driver";

  const [form, setForm] = useState({
    gender: "",
    workingAt: "",
    address: "",
    aadharNumber: "",
    drivingLicense: "",
    vehicleType: "",
    vehicleName: "",
    vehicleNumber: "",
    fuelType: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Aadhaar: digits only
    // if (name === "aadharNumber") {
    //   if (!/^\d*$/.test(value)) return;
    // }
    if (name === "aadharNumber") {

  let cleaned = value.replace(/\D/g, "");

  if (cleaned.length > 12) {
    cleaned = cleaned.slice(0, 12);
  }

  let formatted = cleaned
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4} \d{4})(\d)/, "$1 $2");

  setForm((prev) => ({
    ...prev,
    aadharNumber: formatted,
  }));

  return;
}

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.gender) return "Please select gender.";
    if (!form.workingAt.trim()) return "Please enter working place.";
    if (!form.address.trim()) return "Please enter address.";

    // if (!/^\d{12}$/.test(form.aadharNumber)) {
    //   return "Aadhaar number must be exactly 12 digits.";
    // }
    const aadhaar = form.aadharNumber.replace(/\s/g, "");

if (!/^\d{12}$/.test(aadhaar)) {
  return "Aadhaar number must be exactly 12 digits.";
}

    if (isDriver) {
      // if (!form.drivingLicense.trim())
      //   return "Please enter driving license number.";
      if (!form.drivingLicense.trim())
  return "Please enter driving license number.";

if (
  !/^[A-Z0-9]{10,20}$/i.test(
    form.drivingLicense.trim()
  )
) {
  return "Enter a valid driving license number.";
}

      if (!form.vehicleType)
        return "Please select vehicle type.";

      if (!form.vehicleName.trim())
        return "Please enter vehicle name.";

      if (!/^[A-Z]{2}\s?\d{2}\s?[A-Z]{2}\s?\d{4}$/i.test(form.vehicleNumber)) {
        return "Enter valid vehicle number (e.g. WB 12 AB 1234).";
      }
      if (!form.fuelType)
  return "Please select fuel type.";
    }

    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      gender: form.gender,
      workingAt: form.workingAt,
      address: form.address,
      // aadharNumber: form.aadharNumber,
      aadharNumber: form.aadharNumber.replace(/\s/g, ""),
    };

    if (isDriver) {
      payload.drivingLicense = form.drivingLicense;
      payload.vehicleType = form.vehicleType;
      payload.vehicleName = form.vehicleName;
      payload.vehicleNumber = form.vehicleNumber;
      payload.fuelType = form.fuelType;
    }

    try {
      await api.put("/users/me", payload);
      await refreshProfile();

      navigate(
        isDriver ? "/driver/dashboard" : "/passenger/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError("Profile update failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      {/* <form
        onSubmit={submit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8"
      > */}
      <form
  onSubmit={submit}
  className="
    w-full
    max-w-2xl
    bg-white
    rounded-3xl
    shadow-xl
    border
    border-slate-200
    p-8
    space-y-8
  "
>
        {/* HEADER */}
        {/* <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("completeProfile")}
          </h2>
        </div> */}
        <div>

  <button
    type="button"
    onClick={() => navigate(-1)}
    className="
      text-sm
      font-medium
      text-indigo-600
      hover:text-indigo-700
    "
  >
    ← Back
  </button>

  <div className="flex flex-col items-center mt-4">

    <div
      className="
        w-20
        h-20
        rounded-full
        bg-indigo-100
        flex
        items-center
        justify-center
        text-4xl
      "
    >
      👤
    </div>

    <h2 className="text-3xl font-bold text-slate-900 mt-4">
      Complete Your Profile
    </h2>

    <p className="text-slate-500 mt-2 text-center">
      Add your details to start using RideShare safely.
    </p>

  </div>

</div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* PERSONAL DETAILS */}
        <section className="space-y-4">
          {/* <h3 className="text-sm font-semibold text-slate-700 uppercase">
            {t("personalDetails")}
          </h3> */}
        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
  Personal Information
</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              name="workingAt"
              value={form.workingAt}
              placeholder="Working At"
              onChange={handleChange}
              className="input"
            />

            <input
              name="address"
              value={form.address}
              placeholder="Address"
              onChange={handleChange}
              className="input md:col-span-2"
            />

            <input
              name="aadharNumber"
              value={form.aadharNumber}
              // placeholder="Aadhaar Number (12 digits)"
              // maxLength={12}
              placeholder="1234 5678 9012"
              maxLength={14}
              onChange={handleChange}
              className="input md:col-span-2"
            />
          </div>
        </section>

        {/* DRIVER DETAILS */}
        {isDriver && (
          <>
            <hr />
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase">
                {t("driverVehicle")}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="drivingLicense"
                  value={form.drivingLicense}
                  // placeholder="Driving License Number"
                  placeholder="e.g. WB0120231234567"
                  onChange={handleChange}
                  className="input"
                />

                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Vehicle</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>

                <input
                  name="vehicleName"
                  value={form.vehicleName}
                  placeholder="Vehicle Name"
                  onChange={handleChange}
                  className="input"
                />

                <input
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  placeholder="Vehicle Number (WB 12 AB 1234)"
                  onChange={handleChange}
                  className="input"
                />
                {/* FUEL TYPE */}
<select
  name="fuelType"
  value={form.fuelType}
  onChange={handleChange}
  className="input"
>
  <option value="">Select Fuel Type</option>
  <option value="petrol">Petrol</option>
  <option value="diesel">Diesel</option>
  <option value="electric">Electric</option>
</select>
              </div>
            </section>
          </>
        )}

        <button
          type="submit"
          // className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
          className="
w-full
bg-indigo-600
hover:bg-indigo-700
text-white
py-3.5
rounded-xl
font-semibold
shadow-md
hover:shadow-lg
transition
"
        >
          {/* Save & Continue */}
          Complete Setup
        </button>
      </form>
    </div>
  );
}
