import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const StudentCard = ({
  _id,
  firstname,
  lastname,
  email,
  password,
  degree,
  majors,
  minors,
  courses,
  futureCourses,
  currentyear,
  graduated,
  gpa,
}) => {
  return (
    <div style={{ cursor: "pointer" }}>
      <div
        style={{
          padding: "0.4rem",
          borderRadius: "10px",
          marginTop: 8,
          color: "black",
          background: "white",
          opacity: 0.9,
          border: "2px solid darkred",
        }}
      >
        <>
          <div>
            <span>First Name: {firstname} </span>
          </div>
          <div>
            <span>Last Name: {lastname} </span>
          </div>
          <div>
            <span>Email: {email} </span>
          </div>
          <div>
            <span>Degree: {degree} </span>
          </div>
          <div>
            <span>Major: {majors} </span>
          </div>
          <div>
            <span>Minor: {minors} </span>
          </div>
          <div>
            Courses:{" "}
            {courses.length < 10
              ? courses.join(", ")
              : courses.slice(0, 6).join(",") + ", etc..."}
          </div>
          <div>
            Future Courses:{" "}
            {futureCourses.length < 10
              ? futureCourses.join(", ")
              : futureCourses.slice(0, 6).join(",") + ", etc..."}
          </div>
          <div>
            <span>Current Year: {currentyear} </span>
          </div>

          <div>
            <span>Graduated (T/F): {graduated.toString()} </span>
          </div>
          <div>
            <span>GPA: {gpa} </span>
          </div>
        </>
      </div>
    </div>
  );
};

const StudentViewModal = ({
  show,
  close,
  id,
  firstname,
  lastname,
  email,
  password,
  degree,
  majors,
  minors,
  courses,
  futureCourses,
  currentyear,
  graduated,
  gpa,
}) => {
  return (
    <>
      <Modal
        show={show}
        size="lg"
        scrollable={true}
        onHide={() => {
          close();
        }}
      >
        <Modal.Header>
          <Modal.Title>Student Info Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              minHeight: 250,
            }}
          >
            <div>
              <StudentCard
                firstname={firstname}
                lastname={lastname}
                email={email}
                degree={degree}
                majors={majors}
                minors={minors}
                courses={courses}
                futureCourses={futureCourses}
                currentyear={currentyear}
                graduated={graduated}
                gpa={gpa}
              />
            </div>
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
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentViewModal;
