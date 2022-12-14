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
      userType.toLowerCase() !== "user"
    ) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <>
      <div>DASHBOARD</div>
    </>
  );
};

export default Dashboard;
