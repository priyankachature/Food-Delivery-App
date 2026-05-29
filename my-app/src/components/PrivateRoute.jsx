import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../Context/StoreContext";

const PrivateRoute = ({ children }) => {
  const { user , authLoading } = useContext(StoreContext);

  // If user is logged in, show the protected page
  // Otherwise redirect to login

   if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-amber-600 font-bold">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
