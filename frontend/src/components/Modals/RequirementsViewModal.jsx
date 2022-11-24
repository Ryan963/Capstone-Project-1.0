import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import UpdateRequirementModal from "../../components/Modals/UpdateRequirementModal";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
const RequirementCard = ({ requirement, removeRequirement, index }) => {
  return (
    <div style={{ cursor: "pointer", position: "relative" }}>
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
        <div className="absolute top-3 right-3">
          <AiOutlineClose
            onClick={(e) => {
              e.stopPropagation();
              removeRequirement(requirement, index);
            }}
            className="text-danger cursor-pointer text-2xl"
          />
        </div>
        <div className="row p-2 font-bold">Type: {requirement.type}</div>
        <hr className="m-0" style={{ opacity: "10%" }} />
        {requirement.type === "credits_of_group" && (
          <>
            <div className="flex  w-100">
              <span>Credits: {requirement.credits} </span>
            </div>

            <div className="row p-2">
              Courses:{" "}
              {requirement.courses.length < 10
                ? requirement.courses.join(", ")
                : requirement.courses.slice(0, 6).join(",") + ", etc..."}
            </div>
            <div className="row p-2">
              Description: {requirement.description}
            </div>
          </>
        )}
        {requirement.type === "max_by_level" && (
          <>
            <div className="flex  w-100">
              <span>Credits: {requirement.credits} </span>
            </div>
            <div className="flex  w-100">
              <span>Level: {requirement.level} </span>
            </div>

            <div className="row p-2">
              Description: {requirement.description}
            </div>
          </>
        )}
        {requirement.type === "max_by_discipline" && (
          <>
            <div className="flex  w-100">
              <span>Credits: {requirement.credits} </span>
            </div>
            <div className="flex  w-100">
              <span>Disciplines: {requirement.disciplines.join(", ")} </span>
            </div>

            <div className="row p-2">
              Description: {requirement.description}
            </div>
          </>
        )}
        {requirement.type === "max_by_all_disciplines" && (
          <>
            <div className="flex  w-100">
              <span>Credits: {requirement.credits} </span>
            </div>
            <div className="row p-2">
              Description: {requirement.description}
            </div>
          </>
        )}
        {requirement.type === "max_by_course" && (
          <>
            <div className="flex  w-100">
              <span>Credits: {requirement.credits} </span>
            </div>
            <div className="row p-2">
              Courses:{" "}
              {requirement.courses.length < 10
                ? requirement.courses.join(", ")
                : requirement.courses.slice(0, 6).join(",") + ", etc..."}
            </div>
            <div className="row p-2">
              Description: {requirement.description}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const RequirementsViewModal = ({
  collection,
  name,
  requirements,
  show,
  close,
  deleteRequirementFromState,
  showAddRequirementsModal,
  showUpdateRequirementsModal,
  stream,
}) => {
  const removeRequirement = (requirement, index) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        collection,
        stream,
        name,
        requirement,
        stream,
      },
    };
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_API}/requirements`,

        config
      )
      .then((res) => {
        if (res.data.success) {
          deleteRequirementFromState(index);
          toast.success("Requirement has been deleted successfully");
        } else {
          console.log(res.data.message);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not update requirement");
      });
  };
  return (
    <>
      {requirements && (
        <Modal
          show={show}
          size="lg"
          scrollable={true}
          onHide={() => {
            close();
          }}
        >
          <Modal.Header>
            <Modal.Title>{name} Requirements</Modal.Title>
            <Button
              className="btn"
              variant="success"
              onClick={() => {
                showAddRequirementsModal();
              }}
            >
              Add Requirement
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                minHeight: 300,
              }}
            >
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    //console.log(req);
                    showUpdateRequirementsModal(req);
                  }}
                >
                  <RequirementCard
                    requirement={req}
                    index={idx}
                    removeRequirement={removeRequirement}
                  />
                </div>
              ))}
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
      )}
    </>
  );
};

export default RequirementsViewModal;
