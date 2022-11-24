import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";


function FulfilledReqsModal({ requirements, prereqs, course, show, close }) {
  return (
    <>
      {
        <Modal 
          show={show}
          size="lg"
          style={{ zIndex: 100000 }}
          scrollable = {true}
          onHide={() => {
            close();
          }}
        >
          <Modal.Header>
            <Modal.Title>{course.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style = {{
                minHeight: 300,
              }}
            >
              <div>
                <h5>Requirements Fulfilled:</h5>
                <p>
                  {requirements === undefined || requirements.length === 0 ? (
                    "N/A"
                  ) : (
                    requirements.map((requirement, idx) => {
                      return(
                        <div key={idx}>
                          <div className="py-2">{idx+1} - {requirement.description}</div>
                        </div>
                      )
                    })
                  )}
                </p>
              </div>
              <div>
                <h5>Prerequisite For Following Courses:</h5>
                <p>
                  {prereqs === undefined || prereqs.length === 0 ? (
                    "N/A"
                  ) : (
                    prereqs.map((prereq, idx) => {
                      return(
                        <div key={idx}>
                          <div>{prereq}</div>
                        </div>
                      )
                    })
                  )}
                </p>
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
      }
    </>
  );
}

export default FulfilledReqsModal;