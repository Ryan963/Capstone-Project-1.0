import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  return <div>Dashboard</div>;
};

export default Dashboard;
