import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import UpdateRequirementModal from "../../components/Modals/UpdateRequirementModal";


const RequirementCard = ({ requirement }) => {
  //const [showUpdateRequirementModal, setShowUpdateRequirementModal] = useState(false);
  /* TO DO
  const updateRequirement = (requirement) => {
    const requirementCopy = [...requirement]
  }*/

  return (
    <div 
      style={{ cursor: "pointer" }} 
      
    >
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
  showAddRequirementsModal,
  showUpdateRequirementsModal,
  
}) => {
  
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
