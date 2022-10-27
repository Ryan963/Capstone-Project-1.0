import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import AddStudentModal from "../../components/Modals/AddStudentModal";
import StudentViewModal from "../../components/Modals/StudentViewModel";

const Students = () => {
  const [addStudentModal, setAddStudentModel] = useState(false);
  const [studentViewModal, setStudentViewModel] = useState(false);

  const [students, setStudents] = useState([]);
  const [currentStudents, setCurrentStudents] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
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
        });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }, []);
  
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
                <Button onClick={() => {
                  setAddStudentModel(true); //open the page for adding new user
                }}variant="success">New Student</Button>
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
                          <Dropdown.Item onClick={() => {
                            setCurrentStudents(student);
                            setStudentViewModel(true);
                          }}>
                            View Student info
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}}>
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
        close={() => setAddStudentModel(false)}
      />
      <StudentViewModal
        show={studentViewModal}
        close={() => setStudentViewModel(false)}
        collection={"student"}
        id = {currentStudents._id}
        firstname = {currentStudents.firstname}
        lastname = {currentStudents.lastname}
        email = {currentStudents.email}
        password = {currentStudents.password}
        degree = {currentStudents.degree}
        majors = {currentStudents.majors}
        minors = {currentStudents.minors}
        courses = {currentStudents.courses}
        currentyear = {currentStudents.currentyear}
        currentsemester = {currentStudents.currentsemester}
        graduated = {currentStudents.graduated}
      />
    </div>
  );
};

export default Students;
