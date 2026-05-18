import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../Context/StoreContext";

const AdminRoute = ({ children }) => {
  const { user, authLoading } = useContext(StoreContext);

  // 1. Wait until user data is completely fetched from /api/auth/me
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#ff6347] font-bold uppercase">Loading Admin Access...</div>;
  }

  // 2. Strict authority check matching Spring Security roles
  return user && user.role === "ROLE_ADMIN" ? children : <Navigate to="/profile" />;
};

export default AdminRoute;