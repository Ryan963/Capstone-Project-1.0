import React from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import styles from "../styles/Layout.module.css";
const Navbar = () => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a href="#!" onClick={() => console.log("logout")}>
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
        <Link to="/">
          <i className="fas fa-code"></i>{" "}
          <p className="text-lg font-bold">DegreePlanner</p>
        </Link>
      </h1>
      {guessLinks}
    </nav>
  );
};

export default Navbar;
