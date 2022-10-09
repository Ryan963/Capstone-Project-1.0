import React from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import styles from "../styles/Layout.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");
  const navigate = useNavigate();

  // logs out the user not matter what type he is
  const logout = () => {
    localStorage.clear();
    // navigate user back based on user type
    if (userType.toLowerCase() === "user") {
      navigate("/login");
    } else if (userType === "admin") {
      navigate("/adminLogin");
    }
  };
  const authLinks = (
    <ul>
      <li>
        <a href="#!" onClick={logout}>
          <FaSignOutAlt /> <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );
  const guessLinks = (
    <ul>
      <li>
        <Link to="/login" className="flex items-center">
          <FaSignInAlt />
          <span className="ml-2 font-semibold ">Login</span>
        </Link>
      </li>
      <li>
        <Link to="/register" className="flex items-center">
          <FaUser /> <span className="ml-2 font-semibold">Register</span>
        </Link>
      </li>
    </ul>
  );
  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to="/dashboard">
          <i className="fas fa-code"></i>{" "}
          <p className="text-lg font-bold">DegreePlanner</p>
        </Link>
      </h1>
      {userEmail && userType ? authLinks : guessLinks}
    </nav>
  );
};

export default Navbar;
