import React, { useState } from "react";
import { useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { AiOutlineClose } from "react-icons/ai";

function getSubjects(courses) {
  const subjects = [];
  for (let course of courses) {
    if (!subjects.includes(course.name.slice(0, 4))) {
      subjects.push(course.name.slice(0, 4));
    }
  }
  return subjects;
}

const CourseSelections = ({
  courses,
  removeCourse,
  addCourse,
  addedCourses,
}) => {
  const [filterBySubject, setFilterBySubject] = useState("");
  const [filterByLevel, setFilterByLevel] = useState("");
  const subjects = getSubjects(courses);

  const addAllfilteredCourses = () => {
    const coursesToAdd = courses.filter((course) => {
      if (filterBySubject.length > 0) {
        if (course.name.slice(0, 4) !== filterBySubject) {
          return false;
        }
      }
      if (filterByLevel.length > 0) {
        if (course.name[course.name.length - 3] !== filterByLevel) {
          return false;
        }
      }
      return true;
    });
    console.log(coursesToAdd);
    for (let course of coursesToAdd) {
      addCourse(course);
    }
  };

  const removeAllCourses = () => {
    for (let course of addedCourses) {
      removeCourse(course);
    }
  };

  return (
    <>
      <div className="container border-2 mb-2 rounded-md pt-1 border-black w-full h-36 flex flex-wrap overflow-auto flex-row">
        {addedCourses?.map((course, idx) => (
          <div key={idx} className="p-2 bg-lightgrey rounded-full w-fit h-fit">
            <div className="flex items-center justify-center">
              <span>{course}</span>
              <AiOutlineClose
                onClick={() => removeCourse(course)}
                className="text-danger cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Button onClick={addAllfilteredCourses} variant="success">
            Add All
          </Button>
        </div>

        <Button onClick={removeAllCourses} variant="danger">
          Remove All
        </Button>
      </div>
      <div className="flex justify-between">
        <div>
          <label>filter by Subject: </label>
          <select
            className="w-40 m-2 border rounded-md border-primary "
            name="filterBySubject"
            id="filterBySubject"
            onChange={(e) => setFilterBySubject(e.target.value)}
            value={filterBySubject}
          >
            <option value={""}></option>
            {subjects.map((subject, idx) => (
              <option key={idx} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>filter by Level: </label>
          <select
            className="w-40 m-2 border rounded-md border-primary "
            name="filterByLevel"
            id="filterByLevel"
            value={filterByLevel}
            onChange={(e) => setFilterByLevel(e.target.value)}
          >
            <option value={""}></option>
            <option value="1">100</option>
            <option value="2">200</option>
            <option value="3">300</option>
            <option value="4">400</option>
          </select>
        </div>
      </div>
      <div className="w-full max-h-64 overflow-scroll">
        <ListGroup>
          {courses
            .filter((course) => {
              if (filterBySubject.length > 0) {
                if (course.name.slice(0, 4) !== filterBySubject) {
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
            .map((course) => {
              return (
                <ListGroup.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    addCourse(course);
                  }}
                >
                  {course.name}
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </div>
    </>
  );
};

export default CourseSelections;
