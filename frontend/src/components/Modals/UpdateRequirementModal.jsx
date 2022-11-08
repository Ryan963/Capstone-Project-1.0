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

const UpdateRequirementModal = ({
  show,
  close,
  oldRequirement,
  collection,
  name,
  updateRequirementInCollection,
}) => {
  const [requirement, setRequirement] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const token = localStorage.getItem("token");
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
              oldRequirement,
              newRequirement: { ...requirement },
            },
            config
          )
          .then((res) => {
            if (res.data.success) {
              updateRequirementInCollection(name, oldRequirement, {
                ...requirement,
              });
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
        break;
      default:
        toast.error("requirement type is not selected");
    }
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
                </div>
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
