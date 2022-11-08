import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateUserRoute = ({ auth }) => {
  const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");

  return !userEmail ||
    userEmail.length === 0 ||
    !userType ||
    userType.toLowerCase() !== "user" ? (
    <Navigate to="/login" />
  ) : (
    <Outlet />
  );
};

export default PrivateUserRoute;
