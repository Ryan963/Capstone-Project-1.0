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

const AddPreRequisiteModal = ({ allCourses, setCourse, setActiveStep }) => {
  const [prereq, setPrereq] = useState({
    courses: [],
    description: "",
    credits: 0,
  });

  const handleChange = (e) => {
    setPrereq((prevPrereq) => {
      return {
        ...prevPrereq,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => {
    console.log(prereq);
  }, [prereq]);

  const handleNumberChange = (e) => {
    setPrereq((prevPrereq) => {
      return {
        ...prevPrereq,
        [e.target.name]: Number(e.target.value),
      };
    });
  };

  const addCourseToPrerequisite = (course) => {
    for (let current of prereq.courses) {
      if (current === course.name) {
        toast.error("course is already added");
        return;
      }
    }
    setPrereq((prevPrereq) => {
      return {
        ...prevPrereq,
        courses: [...prevPrereq.courses, course.name],
      };
    });
  };

  const removePrerequisite = (course) => {
    setPrereq((prevPrereq) => {
      const newPrerequsites = [...prevPrereq.courses].filter(
        (p) => p !== course
      );
      return {
        ...prevPrereq,
        courses: newPrerequsites,
      };
    });
  };

  const handleSubmit = () => {
    if (prereq.description.split(" ").length < 2) {
      toast.error("Please add a course description");
      return;
    }

    const credits = Number(prereq.credits);
    let coursesTotalCredits = 0;
    const courses = allCourses.filter((course) =>
      prereq.courses.includes(course.name)
    );
    for (let course of courses) {
      coursesTotalCredits += course.credits;
    }
    if (coursesTotalCredits < credits) {
      toast.error(
        `Credits should be less than the total credits in choosen courses`
      );
      return;
    }

    // check if credits is positive and a multiple of 3
    // *Note can there be non 3 credit courses?
    if (prereq.credits <= 0 || !Number.isInteger(prereq.credits / 3)) {
      toast.error(
        `Credits should be a positive number that is a multiple of 3`
      );
      return;
    }

    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        prerequisites: [...prevCourse.prerequisites, { ...prereq }],
      };
    });
    setPrereq({
      courses: [],
      description: "",
      credits: 0,
    });
    setActiveStep(0);
    toast.success("Pre-requisite has been added successfully");
  };

  return (
    <div>
      <h3>Add a Pre-requisite</h3>
      <Input
        handleChange={handleNumberChange}
        name="credits"
        placeholder="Enter number of credits"
        value={prereq.credits}
        label="Enter number of credits"
        type="number"
      />
      <label className="font-semibold">
        Enter the Courses needed for the Pre-requisite:
      </label>
      <CourseSelections
        addCourse={addCourseToPrerequisite}
        courses={allCourses}
        addedCourses={prereq.courses}
        removeCourse={removePrerequisite}
      />
      <label className="font-semibold text-lg">
        Enter Pre-Requisite Descripion:
      </label>
      <div>
        <textarea
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Course Description..."
          name="description"
          value={prereq.description}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-center items-center">
        <Button
          className="btn   m-2 "
          variant="danger"
          onClick={() => setActiveStep(0)}
        >
          Back
        </Button>
        <Button className="btn   m-2 " variant="success" onClick={handleSubmit}>
          Add Pre-requisite
        </Button>
      </div>
    </div>
  );
};

export default AddPreRequisiteModal;
