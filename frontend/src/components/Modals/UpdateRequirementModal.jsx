import React, { useEffect } from "react";
import { useState } from "react";
import requirementTypes from "../../data/requirement_types.json";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Input from "../UI/Input";
import { toast } from "react-toastify";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import CourseSelections from "../CourseSelections";

function getDisciplines(courses) {
  const subjects = [];
  for (let course of courses) {
    if (!subjects.includes(course.name.slice(0, 4))) {
      subjects.push(course.name.slice(0, 4));
    }
  }
  return subjects;
}

const UpdateRequirementModal = ({
  show,
  close,
  oldRequirement,
  collection,
  name,
  stream,
  updateRequirementInCollection,
}) => {
  const [requirement, setRequirement] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const token = localStorage.getItem("token");

  const disciplines = getDisciplines(allCourses);
  const handleChange = (e) => {
    setRequirement((prevRequirement) => {
      return { ...prevRequirement, [e.target.name]: e.target.value };
    });
  };

  const handleNumberInputChange = (e) => {
    setRequirement((prevRequirement) => {
      return { ...prevRequirement, [e.target.name]: Number(e.target.value) };
    });
  };

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

  const handleTypeChange = (e) => {
    const typeKeys = requirementTypes[e.target.value];
    switch (e.target.value) {
      case "credits_of_group":
        setRequirement({
          type: e.target.value,
          description: "",
          courses: [],
          credits: 0,
        });
        break;
      case "max_by_level":
        setRequirement({
          type: e.target.value,
          description: "",
          credits: 0,
          level: null,
        });
        break;
      case "max_by_discipline":
        setRequirement({
          type: e.target.value,
          description: "",
          credits: 0,
          disciplines: [],
        });
        break;
      case "max_by_all_disciplines":
        setRequirement({
          type: e.target.value,
          description: "",
          credits: 0,
        });
        break;
      case "max_by_course":
        setRequirement({
          type: e.target.value,
          description: "",
          credits: 0,
          courses: [],
        });
        break;
      default:
        toast.error("type does not exist");
    }
  };

  const removeCourse = (course) => {
    setRequirement((prevRequirement) => {
      const newCourses = [...prevRequirement.courses].filter(
        (c) => c !== course
      );
      return {
        ...prevRequirement,
        courses: newCourses,
      };
    });
  };

  const addCourseToCourses = (course) => {
    for (let current of requirement.courses) {
      if (current === course.name) {
        toast.error("Course is already added");
        return;
      }
    }
    setRequirement((prevRequirement) => {
      return {
        ...prevRequirement,
        courses: [...prevRequirement.courses, course.name],
      };
    });
  };

  const handleSubmit = () => {
    switch (requirement.type.toLowerCase()) {
      case "credits_of_group":
        // check if there is any course
        if (requirement.courses.length === 0) {
          toast.error("Please select at least 1 course to choose from");
          return;
        }
        if (requirement.description.split(" ").length < 2) {
          toast.error("Please add a description for your requirement");
          return;
        }
        // check if the credits is positive and a multiple of 3
        const credits = Number(requirement.credits);
        let coursesTotalCredits = 0;
        const courses = allCourses.filter((course) =>
          requirement.courses.includes(course.name)
        );

        for (let course of courses) {
          coursesTotalCredits += course.credits;
        }

        if (coursesTotalCredits < credits) {
          toast.error(
            `Credits should be less than the total credits in chosen courses`
          );
          return;
        }
        if (
          requirement.credits <= 0 ||
          !Number.isInteger(requirement.credits / 3)
        ) {
          toast.error(
            `Credits should be a positive number that is a multiple of 3`
          );
          return;
        }

        break;
      case "max_by_level":
      case "max_by_all_disciplines":
        if (
          requirement.credits <= 0 ||
          !Number.isInteger(requirement.credits / 3)
        ) {
          toast.error(
            `Credits should be a positive number that is a multiple of 3`
          );
          return;
        }
        break;
      case "max_by_discipline":
        if (
          requirement.credits <= 0 ||
          !Number.isInteger(requirement.credits / 3)
        ) {
          toast.error(
            `Credits should be a positive number that is a multiple of 3`
          );
          return;
        }
        if (requirement.disciplines.length < 1) {
          toast.error(`Please choose at least one discipline`);
          return;
        }

        break;
      case "max_by_course":
        if (
          requirement.credits <= 0 ||
          !Number.isInteger(requirement.credits / 3)
        ) {
          toast.error(
            `Credits should be a positive number that is a multiple of 3`
          );
          return;
        }
        if (requirement.courses.length < 1) {
          toast.error(`Please choose at least one Course`);
          return;
        }

        break;
      default:
        toast.error("requirement type is not selected");
    }
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .put(
        `${process.env.REACT_APP_SERVER_API}/requirements`,
        {
          name,
          collection,
          stream,
          oldRequirement,
          newRequirement: { ...requirement },
        },
        config
      )
      .then((res) => {
        if (res.data.success) {
          if (collection === "major") {
            updateRequirementInCollection(name, stream, oldRequirement, {
              ...requirement,
            });
          } else {
            updateRequirementInCollection(name, oldRequirement, {
              ...requirement,
            });
          }
          
          toast.success("Requirement updated successfully!");
          close();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  return (
    <>
      <Modal
        show={show}
        size="lg"
        scrollable={true}
        onHide={() => {
          close();
          setRequirement({ type: "" });
        }}
        onShow={() => {
          setRequirement({
            type: oldRequirement.type,
            credits: oldRequirement.credits,
            courses: oldRequirement.courses,
            description: oldRequirement.description,
          });
        }}
      >
        <Modal.Header>
          <Modal.Title>Update Requirement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              minHeight: 300,
            }}
          >
            <form>
              <label className="font-semibold text-lg">
                Enter the Requirement Type:
              </label>
              <select
                className="w-50 m-2 pt-2 border rounded-md self-center border-primary"
                name="type"
                id="type"
                defaultValue={oldRequirement.type}
                onChange={handleTypeChange}
              >
                <option></option>
                {Object.keys(requirementTypes).map((type, idx) => (
                  <option value={type}>{type}</option>
                ))}
              </select>

              {requirement.type === "credits_of_group" && (
                <div className="mt-3">
                  <Input
                    handleChange={handleNumberInputChange}
                    name="credits"
                    placeholder="Enter number of credits"
                    value={requirement.credits}
                    label="Enter number of credits"
                    type="number"
                  />
                  <label className="font-semibold">
                    Enter the Courses that the user can choose from:
                  </label>

                  <CourseSelections
                    removeCourse={removeCourse}
                    addedCourses={requirement.courses}
                    courses={allCourses}
                    addCourse={addCourseToCourses}
                  />
                </div>
              )}
              {requirement.type === "max_by_level" && (
                <>
                  <Input
                    handleChange={handleNumberInputChange}
                    name="credits"
                    placeholder="Enter number of credits"
                    value={requirement.credits}
                    label="Enter number of credits"
                    type="number"
                  />
                  <div>
                    <label>Level: </label>
                    <select
                      className="w-2/4 m-2 p-2 border rounded-md border-primary "
                      name="level"
                      id="level"
                      value={requirement.level}
                      onChange={handleNumberInputChange}
                    >
                      <option value={""}></option>
                      <option value="1">100</option>
                      <option value="2">200</option>
                      <option value="3">300</option>
                      <option value="4">400</option>
                    </select>
                  </div>
                </>
              )}
              {requirement.type === "max_by_discipline" && (
                <>
                  <Input
                    handleChange={handleNumberInputChange}
                    name="credits"
                    placeholder="Enter number of credits"
                    value={requirement.credits}
                    label="Enter number of credits"
                    type="number"
                  />
                  <Input
                    name="Disciplines"
                    value={requirement?.disciplines?.join(", ")}
                    type="text"
                    disabled={true}
                  />
                  <div>
                    <label>Choose Disciplines: </label>
                    <select
                      className="w-2/4 m-2 p-2 border rounded-md border-primary  "
                      name="disciplines"
                      id="disciplines"
                      onChange={(e) => {
                        setRequirement({
                          ...requirement,
                          disciplines: [
                            ...requirement.disciplines,
                            e.target.value,
                          ],
                        });
                      }}
                    >
                      <option value={""}></option>
                      {disciplines.map((subject, idx) => (
                        <option key={idx} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {requirement.type === "max_by_all_disciplines" && (
                <>
                  <Input
                    handleChange={handleNumberInputChange}
                    name="credits"
                    placeholder="Enter number of credits"
                    value={requirement.credits}
                    label="Enter number of credits"
                    type="number"
                  />
                </>
              )}
              {requirement.type === "max_by_course" && (
                <div className="mt-3">
                  <Input
                    handleChange={handleNumberInputChange}
                    name="credits"
                    placeholder="Enter number of credits"
                    value={requirement.credits}
                    label="Enter number of credits"
                    type="number"
                  />
                  <label className="font-semibold">
                    Enter the Course to Choose from
                  </label>
                  <CourseSelections
                    courses={allCourses}
                    addedCourses={requirement?.courses}
                    addCourse={addCourseToCourses}
                    removeCourse={removeCourse}
                  />
                </div>
              )}
              {requirement?.type?.length > 0 && (
                <>
                  <label className="font-semibold mt-3">
                    Enter Requirement Description:
                  </label>
                  <div>
                    <textarea
                      className="border-2 rounded-md border-black"
                      name="description"
                      cols="60"
                      rows="10"
                      value={requirement.description}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn"
            variant="danger"
            onClick={() => {
              setRequirement({ type: "" });

              close();
            }}
          >
            Close
          </Button>
          <Button
            className="btn"
            variant="info"
            onClick={() => {
              handleSubmit();
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateRequirementModal;
