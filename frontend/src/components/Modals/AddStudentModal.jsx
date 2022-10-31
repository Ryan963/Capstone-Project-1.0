import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";

const AddStudentModal = ({ close, show, students, setStudents }) => {
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
          <Modal.Title>Add A New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div style={{ width: "50%", display: "inline-block" }}>
              <p>First Name: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Last Name: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Email: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Password:</p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Degree: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>GPA: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="number"
              />
            </div>
            <div style={{ width: "50%", display: "inline-block" }}>
              <p style={{ paddingTop: 10 }}>Major: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Minor: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Current Year:</p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 100,
                }}
                type="number"
                id="currentYear"
                name="currentYear"
                min="1"
                max="4"
              />
              <p style={{ paddingTop: 10 }}>Current Semester: </p>
              <input
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 280,
                }}
                type="text"
              />
              <p style={{ paddingTop: 10 }}>Graduated (T/F) :</p>
              <select
                style={{
                  outlineWidth: 1,
                  outlineStyle: "solid",
                  padding: 2,
                  width: 100,
                }}
              >
                <option value="False">False</option>
                <option value="True">True</option>
              </select>
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
          <Button className="btn" variant="info" onClick={() => {}}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStudentModal;
