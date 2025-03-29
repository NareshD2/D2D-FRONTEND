import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const isAuthenticated = Cookies.get("session"); // Check if session exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/mainpage" replace />;
};

export default PrivateRoute;
