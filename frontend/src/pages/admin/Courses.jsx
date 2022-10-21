import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/courses`, config)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  }, []);
  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"courses"} />
      </div>
      <div className="ml-20 w-full mr-20">
        {courses.length > 0 ? (
          <>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div className="font-semibold ml-12">
                <span>Course ID</span>
              </div>
              <div className="font-semibold ml-48">
                <span>Name</span>
              </div>
              <div className="font-semibold  ml-auto text-center">
                <span>Credits</span>
              </div>
              <div className="font-semibold ml-20 text-center ">
                <span>Level</span>
              </div>
              <div className="align-center text-end ml-auto mr-10">
                <Button variant="success">New Course</Button>
              </div>
            </div>
            <div>
              {courses.map((course, idx) => {
                return (
                  <div
                    key={course._id}
                    className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                      idx % 2 === 1 ? "bg-lightblue2" : ""
                    }`}
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "240px",
                      }}
                    >
                      <span>{course._id}</span>
                    </div>
                    <div
                      style={{ width: "20px", marginLeft: "7%" }}
                      className=" flex content-center items-center self-center justify-center p-auto"
                    >
                      <span className="font-bold">{course.name}</span>
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                      }}
                    >
                      <span
                        style={{ width: "20px" }}
                        className="font-bold  ml-auto"
                      >
                        {course.credits}
                      </span>
                    </div>
                    <div className="ml-28">
                      <span className="font-bold">{course.level}</span>
                    </div>
                    <div className="align-center text-end ml-auto mr-10 ">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          More
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {}}>
                            Update
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}}>
                            View Course info
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}}>
                            Delete Course
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
