import React, { useEffect } from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { AiOutlineClose} from "react-icons/ai";
import styles from "../../styles/Login.module.css";

function UpdateCourseModal({
  show,
  close,
  UpdateCourse,
  oldCourse }) {
    
  const {_id, name, description, prerequisites, corequisites, credits, discipline, level } = oldCourse
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState({
    _id: _id,
    name: name,
    prerequisites: prerequisites ? prerequisites : [],
    corequisites: corequisites ? corequisites : [],
    credits: credits,
    discipline: discipline,
    description: description,
    level: level
  })
  const [allCourses, setAllCourses] = useState([]);
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
        [e.target.name]: e.target.value
        
      };
    });
  }

  const handleNumberChange = (e) => {
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        [e.target.name]: Number(e.target.value)
        
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
    setCourse((prevPrerequisite) => {
      return {
        ...prevPrerequisite,
        prerequisites: [...course.prerequisites, prerequisite.name],
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
    setCourse((prevCorequisite) => {
      return {
        ...prevCorequisite,
        corequisites: [...course.corequisites, corequisite.name],
      };
    });
  };

  const removePrerequisite = (prerequisite) => {
    const newPrerequsites = [...course.prerequisites].filter((p) => p !== prerequisite);
    setCourse((prevPrerequisite) => {
      return {
        ...prevPrerequisite,
        prerequisites: newPrerequsites,
      };
    });
  }

  const removeCorequisite = (corequisite) => {
    const newCorequsites = [...course.corequisites].filter((c) => c !== corequisite);
    setCourse((prevCorequisite) => {
      return {
        ...prevCorequisite,
        corequisites: newCorequsites,
      };
    });
  }

  const sendPutRequest = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .put(
        `${process.env.REACT_APP_SERVER_API}/courses/${_id}`,
        {
          course
        },
        config
      )
      .then((res) => {
        if (res.data.success) {
          UpdateCourse( course );
          toast.success("Course updated successfully!"); 
        } else {
          //* error message undefined
          toast.error("Error: " + res.data.message);
        }
        close();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }
    
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
    if (
      course.credits <= 0 ||
      !Number.isInteger(course.credits / 3)
    ) {
      toast.error(
        `Credits should be a positive number that is a multiple of 3 ${course.credits}`
      );
      return;
    }
    if (course.discipline === "") {
      toast.error("Please enter course discipline");
      return;
    }
    sendPutRequest()  
  };

  return (
    <>
    <Modal
        show={show}
        size="lg"
        scrollable={true}
        onHide={() => {
          close();
        }}
        onShow={() => {
          setCourse({
            _id: _id,
            name: name,
            prerequisites: prerequisites ? prerequisites : [],
            corequisites: corequisites ? corequisites : [],
            credits: credits,
            discipline: discipline,
            description: description,
            level: level
          })
        }}
      >
        <Modal.Header>
          <Modal.Title>Update Course</Modal.Title>
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
                defaultValue={name}
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
                name="description"
                defaultValue={description}
                onChange={handleChange}
                />
              </div>
              <div className={`mt-1 mb-3`}>
                <label className="font-semibold text-lg">Enter Number of Credits:</label>
                <input
                  className={styles.input2}
                  onChange={handleNumberChange}
                  type="number"
                  placeholder='Enter number of credits'
                  name='credits'
                  defaultValue={credits}
                />
              </div>
              <div>
                {/* TODO: use dropdown instead of text input? */}
                <label className="font-semibold text-lg">
                Course Discipline:
                </label>
                <input 
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name" 
                type="text" 
                name="discipline"
                placeholder="ex. 'English'"
                onChange={handleChange}
                defaultValue={discipline}
              />
              </div>
              <div>
                <label className="font-semibold text-lg">
                Course Level:
                </label>
                <select 
                  className= "w-50 m-2 pt-2 border rounded-md self-center border-primaryt"
                  onChange={handleNumberChange}
                  placeholder={level}
                  name="level"
                >
                  <option> {level} </option>
                  {[1,2,3,4].map((option, idx) => {
                    if (idx + 1 !== level){
                      return <option key={idx}> {option} </option>
                    } else {return<></>}
                  })}
                </select>
              </div>
              <label className="font-semibold text-lg">
                Course Corequisites:
              </label>
              <div className="container border-2 mb-2 rounded-md pt-1 border-black w-full h-36 flex flex-wrap flex-row">
                    {course.corequisites.map((corequisite, idx) => (
                      <div className="p-2 bg-lightgrey rounded-full w-fit h-fit">
                        <div className="flex items-center justify-center">
                          <span>{corequisite}</span>
                          <AiOutlineClose
                            onClick={() => removeCorequisite(corequisite)}
                            className="text-danger cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
              <div className="w-full max-h-64 overflow-scroll">
                    <ListGroup>
                      {allCourses.map((course) => {
                        return (
                          <ListGroup.Item
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              addCourseToCorequisites(course);
                            }}
                          >
                            {course.name}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
              </div>
              <label className="font-semibold">
                Enter the Course Prerequisites
              </label>
              <div className="container border-2 mb-2 rounded-md pt-1 border-black w-full h-36 flex flex-wrap flex-row">
                    {course?.prerequisites.map((prerequisite, idx) => (
                      <div className="p-2 bg-lightgrey rounded-full w-fit h-fit">
                        <div className="flex items-center justify-center">
                          <span>{prerequisite}</span>
                          <AiOutlineClose
                            onClick={() => removePrerequisite(prerequisite)}
                            className="text-danger cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
              <div className="w-full max-h-64 overflow-scroll">
                    <ListGroup>
                      {allCourses.map((course) => {
                        return (
                          <ListGroup.Item
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              addCourseToPrerequisites(course);
                            }}
                          >
                            {course.name}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
              </div>
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
          <Button
            className="btn"
            variant="success"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UpdateCourseModal