import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import ViewCourseModal from "../../components/Modals/ViewCourseModal";
import UpdateCourseModal from "../../components/Modals/UpdateCourseModal";
import AddCourseModal from "../../components/Modals/AddCourseModal";
import DeletCourseModal from "../../components/Modals/DeletCourseModal";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [showUpdateCourseModal, setShowUpdateCourseModal] = useState(false);
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

  const addCourse = (course) => {
    const newCourseList = [...courses, course]
    setCourses(newCourseList)
  };

  const deleteCourse = (course) => {
    const updatedCourses = [...courses]
    setCourses(updatedCourses)
  }

  const updateCourseInList =  (updatedCourse) => {
    const updatedCourses = [...courses]
    const idx = courses.findIndex(c => {
      return c._id === updatedCourse._id
    })
    Object.assign(updatedCourses[idx], updatedCourse)
    setCourses(updatedCourses)
  }

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
                <Button variant="success" onClick={() => {
                  setShowAddCourseModal(true)}}>
                  New Course
                </Button>
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
                          <Dropdown.Item onClick={() => {
                            setCurrentCourse(course)
                            setShowUpdateCourseModal(true)
                          }}>
                            Update
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {
                            setCurrentCourse(course)
                            setShowCourseModal(true)
                          }}>
                            View Course info
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {
                            setCurrentCourse(course)
                            setShowDeleteCourseModal(true)
                          }}>
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
      <AddCourseModal
        show={showAddCourseModal}
        close={() => setShowAddCourseModal(false)}
        addCourseToCollection={addCourse}
      />
      <DeletCourseModal
        show={showDeleteCourseModal}
        close={() => setShowDeleteCourseModal(false)}
        course={currentCourse}
        deleteCourseFromCollection={deleteCourse}
      />
      <ViewCourseModal
        show={showCourseModal}
        close={() => setShowCourseModal(false)}
        course={currentCourse}
      />
      <UpdateCourseModal
        show={showUpdateCourseModal}
        close={() => {
          setShowUpdateCourseModal(false)
        }}
        updateCourse={updateCourseInList}
        oldCourse={currentCourse}
      />
    </div>
  );
};

export default Courses;
