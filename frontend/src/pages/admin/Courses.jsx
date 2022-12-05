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
import DeleteObjectModal from "../../components/Modals/DeleteObjectModal";
import useCourses from "../../hooks/useCourses";

const Courses = () => {
  const [courses, setCourses] = useCourses();
  const [currentCourse, setCurrentCourse] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showDeleteObjectModal, setShowDeleteObjectModal] = useState(false);
  const [showUpdateCourseModal, setShowUpdateCourseModal] = useState(false);
  const [filterByDiscipline, setFilterByDiscipline] = useState("");
  const [filterByLevel, setFilterByLevel] = useState("");

  function getDisciplines(courses) {
    const disciplines = [];
    for (let course of courses) {
      if (!disciplines.includes(course.discipline)) {
        disciplines.push(course.discipline);
      }
    }
    return disciplines.sort();
  }
  const disciplines = getDisciplines(courses);

  const addCourse = (course) => {
    const newCourseList = [...courses, course];
    setCourses(newCourseList);
  };

  const deleteCourse = (course) => {
    const updatedCourses = courses.filter((c) => c !== course);
    setCourses(updatedCourses);
  };

  const updateCourseInList = (updatedCourse) => {
    const updatedCourses = [...courses];
    const idx = courses.findIndex((c) => {
      return c._id === updatedCourse._id;
    });
    Object.assign(updatedCourses[idx], updatedCourse);
    setCourses(updatedCourses);
  };

  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"courses"} />
      </div>
      <div className="ml-20 w-full mr-20">
        {courses.length > 0 ? (
          <>
            <div className="flex justify-between">
              <div>
                <label className="font-semibold text-lg">
                  Course Discipline:
                </label>

                <select
                  // className="w-40 m-2 border rounded-md border-primary "
                  className=" w-40 p-2.5 m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-first-name"
                  type="text"
                  name="discipline"
                  onChange={(e) => setFilterByDiscipline(e.target.value)}
                  value={filterByDiscipline}
                >
                  <option value={""}>All</option>
                  {disciplines.map((discipline, idx) => (
                    <option key={idx} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-lg">Course Level:</label>
                <select
                  className=" w-40 p-2.5 m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="filterByLevel"
                  id="filterByLevel"
                  value={filterByLevel}
                  onChange={(e) => setFilterByLevel(e.target.value)}
                >
                  <option value={""}>All</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
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
                <Button
                  variant="success"
                  onClick={() => {
                    setShowAddCourseModal(true);
                  }}
                >
                  New Course
                </Button>
              </div>
            </div>
            <div>
              {courses
                .filter((course) => {
                  if (filterByDiscipline.length > 0) {
                    if (course.discipline !== filterByDiscipline) {
                      return false;
                    }
                  }
                  if (filterByLevel.length > 0) {
                    if (course.name[course.name.length - 3] !== filterByLevel) {
                      return false;
                    }
                  }
                  return true;
                })
                .map((course, idx) => {
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
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            More
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                setCurrentCourse(course);
                                setShowUpdateCourseModal(true);
                              }}
                            >
                              Update
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setCurrentCourse(course);
                                setShowCourseModal(true);
                              }}
                            >
                              View Course info
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setCurrentCourse(course);
                                setShowDeleteObjectModal(true);
                              }}
                            >
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
      <DeleteObjectModal
        show={showDeleteObjectModal}
        close={() => setShowDeleteObjectModal(false)}
        object={currentCourse}
        collection={"courses"}
        deleteFromCollection={deleteCourse}
      />
      <ViewCourseModal
        show={showCourseModal}
        close={() => setShowCourseModal(false)}
        course={currentCourse}
      />
      <UpdateCourseModal
        show={showUpdateCourseModal}
        close={() => {
          setShowUpdateCourseModal(false);
        }}
        updateCourse={updateCourseInList}
        oldCourse={currentCourse}
      />
    </div>
  );
};

export default Courses;
