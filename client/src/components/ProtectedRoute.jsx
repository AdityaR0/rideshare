import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loadingUser } = useAuth();
  if (loadingUser) {
  return <div>Loading...</div>;
}
  console.log("ProtectedRoute User =", user);

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 FORCE PROFILE COMPLETION (except admin)
  if (
    user.role !== "admin" &&
    user.isProfileComplete === false &&
    window.location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/complete-profile" replace />;
  }

  // role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
