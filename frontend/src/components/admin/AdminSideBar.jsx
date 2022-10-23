import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendar,
  FaChartBar,
  FaFolder,
  FaGraduationCap,
  FaUserGraduate,
} from "react-icons/fa";

function getWindowWidth() {
  return window.innerWidth;
}

function SideBarItem({ link, route, Icon, text, selectedRoute }) {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowWidth());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  const activeStyle = "text-lightblue bg-lightblue2";
  return (
    <div>
      <Link to={link} style={{ textDecoration: "none" }}>
        <div
          className={`flex  p-3  ${
            route === selectedRoute && activeStyle
          } hover:bg-lightblue2 hover:text-lightblue`}
        >
          <Icon />
          {windowWidth > 850 && <h5 className="pl-3">{text}</h5>}
        </div>
      </Link>
    </div>
  );
}

export default function AdminSidebar({ route }) {
  return (
    <>
      <div
        className={` top-0 border ml-3 w-full border-black border-solid z-auto `}
      >
        <div>
          <div className="pt-3 bg-dark2"></div>
          <SideBarItem
            link="/admin/degrees"
            Icon={() => <FaGraduationCap size={24} />}
            text="Degrees"
            route="degrees"
            selectedRoute={route}
          />
          <SideBarItem
            link="/admin/majors"
            Icon={() => <FaGraduationCap size={24} />}
            text="Majors"
            route="majors"
            selectedRoute={route}
          />
          <SideBarItem
            link="/admin/minors"
            Icon={() => <FaGraduationCap size={24} />}
            text="Minors"
            route="minors"
            selectedRoute={route}
          />
          <SideBarItem
            link="/admin/courses"
            Icon={() => <FaFolder size={24} />}
            text="courses"
            route="courses"
            selectedRoute={route}
          />
          <SideBarItem
            link="/admin/students"
            Icon={() => <FaUserGraduate size={24} />}
            text="Current Students"
            route="students"
            selectedRoute={route}
          />
          <SideBarItem
            link="/admin/analytics"
            Icon={() => <FaChartBar size={24} />}
            text="Analytics"
            route="analytics"
            selectedRoute={route}
          />
        </div>
      </div>
    </>
  );
}
