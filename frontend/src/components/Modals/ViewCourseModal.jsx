import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PrereqsDisplay from "../PrereqsDisplay";

function ViewCourseModal({ course, show, close }) {
  const {
    name,
    description,
    prerequisites,
    corequisites,
    credits,
    discipline,
  } = course;
  return (
    <>
      {
        <Modal
          show={show}
          size="lg"
          style={{ zIndex: 100000 }}
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
                  {prerequisites === undefined || prerequisites.length === 0 ? (
                    "N/A"
                  ) : (
                    <PrereqsDisplay
                      prerequisites={prerequisites}
                      viewOnly={true}
                    />
                  )}
                </p>
              </div>
              <div>
                <h5>Corequisites:</h5>
                <p>
                  {corequisites === undefined || corequisites.length === 0
                    ? "N/A"
                    : corequisites}
                </p>
              </div>
              <div>
                <h5 class="inline">Credits: </h5>
                <span>{credits}</span>
              </div>
              <div>
                <h5 class="inline">Discipline: </h5>
                <span>{discipline}</span>
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

export default ViewCourseModal;
