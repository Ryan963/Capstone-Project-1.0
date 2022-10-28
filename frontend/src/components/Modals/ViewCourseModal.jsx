import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ViewCourseModal({
  course,
  show,
  close,
}) {
     const {name, description, prerequisites, corequisites, credits, discipline } = course
  return (
    <>
      {(
        <Modal
          show={show}
          size="lg"
          scrollable={true}
          onHide={() => {
            close();
          }}
        >
          <Modal.Header>
            <Modal.Title>{name} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                minHeight: 300,
              }}
            >
              <div>
                <h5>Description:</h5>
                <p>{description}</p>
              </div>
              <div>
                <h5>Prerequisites:</h5>
                <p>
                {(prerequisites === undefined || prerequisites.length === 0) ?
                  "N/A" : prerequisites } 
                </p>
              </div>
              <div>
                <h5>Corequisites:</h5>
                <p>
                {(corequisites === undefined || corequisites.length === 0) ?
                  "N/A" : corequisites }
                </p>
              </div>
              <div>
                <h5>Credits: {credits}</h5>
              </div>
              <div>
                <h5>Discipline: {discipline}</h5>
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
      )}
    </>
  )
}

export default ViewCourseModal