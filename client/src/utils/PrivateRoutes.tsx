import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthAPI from "./AuthAPI";

const PrivateRoute = () => {
  const { session } = useContext(AuthAPI);
  return session.authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
