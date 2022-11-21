import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import AddStudentModal from "../../components/Modals/AddStudentModal";
import StudentViewModal from "../../components/Modals/StudentViewModal";
import DeleteStudentModal from "../../components/Modals/DeleteStudentModal";

const Students = () => {
  const [majors, setMajors] = useState([]);
  const [currentMajor, setCurrentMajor] = useState({});
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [studentViewModal, setStudentViewModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    getUsers();
    getMajors();
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
    };
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

  const addStudent = (student) => {
    const newStudentList = [...students, student]
    setStudents(newStudentList)
  };

  const deleteStudent = (student) => {
    const updatedStudents = students.filter((u) => u !== student)
    setStudents(updatedStudents)
  }
  /*
  const checkMajor = (id) =>{
    const majorsCopy = [...majors];
    for (let i = 0; i < majorsCopy.length; i++) {
      if (majorsCopy[i]._id === id) {
        console.log("id"+id);
        console.log("major"+majorsCopy[i]._id);
        currentMajor = majorsCopy[i].name;
        return currentMajor;
      }
    }
  }*/

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
              <div className="align-center text-end ml-auto mr-10">
                <Button
                  onClick={() => {
                    setAddStudentModal(true); //open the page for adding new user
                  }}
                  variant="success"
                >
                  New Student
                </Button>
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
                              setCurrentMajor(student.majors);
                            }}
                          >
                            View Student info
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {
                            setCurrentStudent(student);
                            setShowDeleteStudentModal(true);
                          }}>
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
      <AddStudentModal
        show={addStudentModal}
        close={() => setAddStudentModal(false)}
        addStudentToCollection={addStudent}
      />
      <StudentViewModal
        show={studentViewModal}
        close={() => setStudentViewModal(false)}
        id={currentStudent._id}
        firstname={currentStudent.firstname}
        lastname={currentStudent.lastname}
        email={currentStudent.email}
        password={currentStudent.password}
        degree={currentStudent.degree}
        majors={currentStudent.majors}
        minors={currentStudent.minors}
        courses={currentStudent.courses}
        futureCourses={currentStudent.futureCourses}
        currentyear={currentStudent.currentyear}
        currentsemester={currentStudent.currentsemester}
        graduated={currentStudent.graduated}
        gpa={currentStudent.gpa}
      />
      <DeleteStudentModal
        show={showDeleteStudentModal}
        close={() => setShowDeleteStudentModal(false)}
        student = {currentStudent}
        collection = {"user"}
        deleteStudentFromCollection={deleteStudent}
      />
    </div>
  );
};

export default Students;
