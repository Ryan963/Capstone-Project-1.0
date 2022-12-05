import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

function NewDisciplineModal({ show, close, newDiscipline }) {
  const [discipline, setDiscipline] = useState("");

  const handleSubmit = () => {
    if (discipline === "") {
      toast.error("Enter Discipline");
      return;
    }
    //* check if already exists

    toast.success(discipline + " succussfully added");
    newDiscipline(discipline);
    setDiscipline("");
    close();
  };

  return (
    <>
      <Modal show={show} onHide={close} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>New Discipline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="font-semibold text-lg">Enter Discipline: </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            name="input"
            onChange={(e) => {
              setDiscipline(e.target.value);
            }}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={close}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewDisciplineModal;
