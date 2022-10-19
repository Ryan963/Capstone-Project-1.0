import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSideBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");

  useEffect(() => {
    if (
      !userEmail ||
      userEmail.length === 0 ||
      !userType ||
      userType.toLowerCase() !== "admin"
    ) {
      navigate("/adminLogin");
    }
  }, [navigate]);
  return (
    <>
      <AdminSidebar route={"degrees"} />
    </>
  );
};

export default Dashboard;
