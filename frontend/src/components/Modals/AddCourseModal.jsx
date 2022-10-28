import React, { useEffect } from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Input from "../UI/Input";
import { toast } from "react-toastify";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import CourseSelections from "../CourseSelections";

function getDisciplines(courses) {
  const disciplines = [];
  for (let course of courses) {
    if (!disciplines.includes(course.discipline)) {
      disciplines.push(course.discipline);
    }
  }
  return disciplines;
}

function AddCourseModal({ show, close, addCourseToCollection }) {
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState({
    name: "",
    prerequisites: [],
    corequisites: [],
    credits: 0,
    discipline: "",
    description: "",
    level: 0,
  });
  const [allCourses, setAllCourses] = useState([]);

  const disciplines = getDisciplines(allCourses);

  const retrieveCourses = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/courses`, config)
      .then((res) => {
        setAllCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.err(err.message);
      });
  };

  useEffect(() => {
    retrieveCourses();
  }, []);

  const handleChange = (e) => {
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleNumberChange = (e) => {
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        [e.target.name]: Number(e.target.value),
      };
    });
  };

  const addCourseToPrerequisites = (prerequisite) => {
    for (let current of course.prerequisites) {
      if (current === prerequisite.name) {
        toast.error("Prerequisite is already added");
        return;
      }
    }
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        prerequisites: [...prevCourse.prerequisites, prerequisite.name],
      };
    });
  };

  const addCourseToCorequisites = (corequisite) => {
    for (let current of course.corequisites) {
      if (current === corequisite.name) {
        toast.error("Corequisite is already added");
        return;
      }
    }
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        corequisites: [...prevCourse.corequisites, corequisite.name],
      };
    });
  };

  const removePrerequisite = (prerequisite) => {
    setCourse((prevCourse) => {
      const newPrerequsites = [...prevCourse.prerequisites].filter(
        (p) => p !== prerequisite
      );
      return {
        ...prevCourse,
        prerequisites: newPrerequsites,
      };
    });
  };

  const removeCorequisite = (corequisite) => {
    setCourse((prevCourse) => {
      const newCorequsites = [...prevCourse.corequisites].filter(
        (c) => c !== corequisite
      );
      return {
        ...prevCourse,
        corequisites: newCorequsites,
      };
    });
  };

  /*
    Checks TODO (when updating and adding course):
      check if course name exsists
      check name format
      check if level and course name are consistent
      make sure no overlap b/w prereqs and coreqs
      ...
  */
  const handleSubmit = () => {
    if (course.name === "") {
      toast.error("Please enter course name");
      return;
    }
    if (course.description.split(" ").length < 2) {
      toast.error("Please add a course description");
      return;
    }
    // check if credits is positive and a multiple of 3
    // *Note can there be non 3 credit courses?
    if (course.credits <= 0 || !Number.isInteger(course.credits / 3)) {
      toast.error(
        `Credits should be a positive number that is a multiple of 3`
      );
      return;
    }
    if (course.discipline === "") {
      toast.error("Please enter course discipline");
      return;
    }

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER_API}/courses`,
        {
          course,
        },
        config
      )
      .then((res) => {
        if (res.data.success) {
          addCourseToCollection(res.data.course);
          toast.success("Course added successfully!");
        } else {
          toast.error("Error: " + res.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
    close();
  };

  return (
    <>
      <Modal show={show} size="lg" scrollable={true}>
        <Modal.Header>
          <Modal.Title>Add A Course </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              minHeight: 300,
            }}
          >
            <form>
              <label className="font-semibold text-lg">
                Enter the Course Name:
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="ex: 'ENGL102'"
                name="name"
                value={course.name}
                onChange={handleChange}
              />
              <label className="font-semibold text-lg">
                Enter Course Descritpion:
              </label>
              <div>
                <textarea
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Course Description..."
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                />
              </div>
              <Input
                handleChange={handleNumberChange}
                name="credits"
                placeholder="Enter number of credits"
                value={course.credits}
              />
              <div>
                <label className="font-semibold text-lg">
                  Course Discipline:
                </label>

                <select
                  className="w-40 m-2 border rounded-md border-primary "
                  id="grid-first-name"
                  type="text"
                  name="discipline"
                  placeholder="ex. English"
                  onChange={handleChange}
                  value={course.discipline}
                >
                  <option value={""}></option>
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
                  className="w-50 m-2 pt-2 border rounded-md self-center border-primaryt"
                  onChange={handleNumberChange}
                  value={course.level}
                  name="level"
                >
                  <option value="1">100</option>
                  <option value="2">200</option>
                  <option value="3">300</option>
                  <option value="4">400</option>
                </select>
              </div>
              <label className="font-semibold text-lg">
                Course Corequisites:
              </label>

              <CourseSelections
                addCourse={addCourseToCorequisites}
                courses={allCourses}
                addedCourses={course.corequisites}
                removeCourse={removeCorequisite}
              />
              <label className="font-semibold">
                Enter the Course Prerequisites
              </label>

              <CourseSelections
                addCourse={addCourseToPrerequisites}
                courses={allCourses}
                addedCourses={course.prerequisites}
                removeCourse={removePrerequisite}
              />
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn"
            variant="danger"
            onClick={() => {
              close();
            }}
          >
            Cancel
          </Button>
          <Button className="btn" variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCourseModal;
