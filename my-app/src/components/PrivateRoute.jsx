import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../Context/StoreContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(StoreContext);

  // If user is logged in, show the protected page
  // Otherwise redirect to login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
