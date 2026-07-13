import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";

import PassengerDashboard from "./pages/dashboard/PassengerDashboard";
import DriverDashboard from "./pages/dashboard/DriverDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import PassengerProfilePage from "./pages/profile/PassengerProfilePage";
import DriverProfilePage from "./pages/profile/DriverProfilePage";
import CompleteProfile from "./pages/profile/CompleteProfile";
import DriverVehicleProfile from "./pages/profile/DriverVehicleProfile";

import PassengerMyRides from "./pages/passenger/MyRides";
import PassengerRideDetails from "./pages/passenger/RideDetails";
import DriverMyRides from "./pages/driver/MyRides";
import DriverRideDetails from "./pages/driver/RideDetails";

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Ai from "./components/Ai";
import Payment from "./pages/Payment";
import ReviewPage from "./components/ReviewPage";

import CommunityList from "./pages/CommunityList";
import Community from "./pages/Community";
import Notifications from "./pages/Notifications";

import RideCoins from "./pages/RideCoins";
import RentVehicle from "./pages/rental/RentVehicle";

import TMSLCommunity from "./pages/TMSLCommunity";
import InfosysCommunity from "./pages/InfosysCommunity";
import ActiveRideWidget from "./components/ActiveRideWidget";
import RentalBookings from "./pages/driver/RentalBookings";
import MyRentals from "./pages/passenger/MyRentals";
import RentVehicles from "./pages/passenger/RentVehicles";
import RentalVehicleDetails from "./pages/passenger/RentalVehicleDetails";
import RentalPayment from "./pages/RentalPayment";
import RentalBookingDetails from "./pages/passenger/RentalBookingDetails";
import DriverRentalBookingDetails from "./pages/driver/RentalBookingDetails";


function App() {
  return (
    <Layout>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route
  path="/ridecoins"
  element={
    <ProtectedRoute>
      <RideCoins />
    </ProtectedRoute>
  }
/>

        {/* ================= HIDDEN ADMIN LOGIN ================= */}
        <Route path="/secure-admin-login" element={<AdminLogin />} />

        {/* ================= COMPLETE PROFILE ================= */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= PASSENGER ================= */}
        <Route
          path="/passenger/dashboard"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger/profile"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <PassengerProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger/my-rides"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <PassengerMyRides />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger/ride/:id"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <PassengerRideDetails />
            </ProtectedRoute>
          }
        />
        <Route
  path="/passenger/my-rentals"
  element={
    <ProtectedRoute allowedRoles={["passenger"]}>
      <MyRentals />
    </ProtectedRoute>
  }
/>

<Route
  path="/passenger/rent-vehicles"
  element={
    <ProtectedRoute allowedRoles={["passenger"]}>
      <RentVehicles />
    </ProtectedRoute>
  }
/>
<Route
  path="/passenger/rental/:id"
  element={
    <ProtectedRoute allowedRoles={["passenger"]}>
      <RentalVehicleDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/rental-payment"
  element={
    <ProtectedRoute allowedRoles={["passenger"]}>
      <RentalPayment />
    </ProtectedRoute>
  }
/>
<Route
  path="/passenger/my-rentals/:bookingId"
  element={<RentalBookingDetails />}
/>
<Route
  path="/driver/rental-bookings/:bookingId"
  element={
    <ProtectedRoute allowedRoles={["driver"]}>
      <DriverRentalBookingDetails />
    </ProtectedRoute>
  }
/>

        {/* ================= DRIVER ================= */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/profile"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/vehicle"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverVehicleProfile />
            </ProtectedRoute>
          }
        />

        <Route
  path="/driver/rent-vehicle"
  element={
    <ProtectedRoute allowedRoles={["driver"]}>
      <RentVehicle />
    </ProtectedRoute>
  }
/>

{/* <Route
  path="/driver/rental-bookings"
  element={
    <ProtectedRoute allowedRoles={["driver"]}>
      <h1 className="text-3xl text-center py-20">
        Rental Bookings Page
      </h1>
    </ProtectedRoute>
  }
/> */}

        <Route
          path="/driver/my-rides"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverMyRides />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/ride/:id"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverRideDetails />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= REVIEW ================= */}
        <Route
          path="/review"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <ReviewPage />
            </ProtectedRoute>
          }
        />

        {/* ================= COMMUNITY ================= */}
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/local"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />


<Route
  path="/driver/rental-bookings"
  element={
    <ProtectedRoute allowedRoles={["driver"]}>
      <RentalBookings />
    </ProtectedRoute>
  }
/>


        <Route
  path="/community/tmsl"
  element={
    <ProtectedRoute>
      <TMSLCommunity />
    </ProtectedRoute>
  }
/>

<Route
  path="/community/infosys"
  element={
    <ProtectedRoute>
      <InfosysCommunity />
    </ProtectedRoute>
  }
/>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Ai />
      <ActiveRideWidget />
    </Layout>
  );
}

export default App;
