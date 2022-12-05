import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import StudentViewModal from "../../components/Modals/StudentViewModal";
import DeleteStudentModal from "../../components/Modals/DeleteStudentModal";

const Students = () => {
  const [majors, setMajors] = useState([]);
  const [currentMajor, setCurrentMajor] = useState({});
  const [degrees, setDegrees] = useState([]);
  const [currentDegree, setCurrentDegree] = useState({});
  const [minors, setMinors] = useState([]);
  const [currentMinor, setCurrentMinor] = useState({});
  const [studentViewModal, setStudentViewModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    getUsers();
    getMajors();
    getMinors();
    getDegrees();
  }, []);

  const getUsers = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_API}/user`, config)
        .then((res) => {
          setStudents(res.data.users);
          //console.log(students);
        });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getMajors = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/majors`, config)
      .then((res) => {
        //console.log(res.data);
        setMajors(res.data);
        //console.log(majors);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getDegrees = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/degree`, config)
      .then((res) => {
        setDegrees(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  const getMinors = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/minors`, config)
      .then((res) => {
        setMinors(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  }

  const checkDegrees = (id) =>{
    for (let i = 0; i < degrees.length; i++) {
      if (degrees[i]._id === id) {
        setCurrentDegree(degrees[i].name);
      }
    }
  }
  const checkMinors = (idArray) =>{
    var id = idArray[0];
    for (let i = 0; i < minors.length; i++) {
      if (minors[i]._id === id) {
        setCurrentMinor(minors[i].name);
      }
    }
  }
  const checkMajors = (idArray) =>{
    var id = idArray[0];
    for (let i = 0; i < majors.length; i++) {
      if (majors[i]._id === id) {
        setCurrentMajor(majors[i].name);
      }
    }
  }


  const deleteStudent = (student) => {
    const updatedStudents = students.filter((u) => u !== student);
    setStudents(updatedStudents);
  };
  

  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"students"} />
      </div>
      <div className="ml-20 w-full mr-20 ">
        {students.length > 0 ? (
          <>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div style={{ width: "240px" }} className="font-semibold ml-12">
                <span>Student ID</span>
              </div>
              <div style={{ marginLeft: "7%" }} className="font-semibold ml-40">
                <span>Name</span>
              </div>
            </div>
            <div>
              {students.map((student, idx) => {
                return (
                  <div
                    key={student._id}
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
                      <span>{student._id}</span>
                    </div>
                    <div
                      style={{ marginLeft: "7%" }}
                      className=" flex content-center items-center self-center justify-center p-auto"
                    >
                      <span className="font-bold ml-10">
                        {student.firstname + " " + student.lastname}
                      </span>
                    </div>

                    <div className="align-center text-end ml-auto mr-10 ">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          More
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentStudent(student);
                              setStudentViewModal(true);
                              checkDegrees(student.degree);
                              checkMajors(student.majors);
                              checkMinors(student.minors);
                            }}
                          >
                            View Student info
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentStudent(student);
                              setShowDeleteStudentModal(true);
                            }}
                          >
                            Delete Student
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
      <StudentViewModal
        show={studentViewModal}
        close={() => setStudentViewModal(false)}
        firstname={currentStudent.firstname}
        lastname={currentStudent.lastname}
        email={currentStudent.email}
        degree={currentDegree}
        majors={currentMajor}
        minors={currentMinor}
        courses={currentStudent.courses}
        futureCourses={currentStudent.futureCourses}
        currentyear={currentStudent.currentyear}
        graduated={currentStudent.graduated}
        gpa={currentStudent.gpa}
      />
      <DeleteStudentModal
        show={showDeleteStudentModal}
        close={() => setShowDeleteStudentModal(false)}
        student={currentStudent}
        collection={"user"}
        deleteStudentFromCollection={deleteStudent}
      />
    </div>
  );
};

export default Students;
