import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateAdminRoute = () => {
  const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");

  return !userEmail ||
    userEmail.length === 0 ||
    !userType ||
    userType.toLowerCase() !== "admin" ? (
    <Navigate to="/admin/login" />
  ) : (
    <Outlet />
  );
};

export default PrivateAdminRoute;
