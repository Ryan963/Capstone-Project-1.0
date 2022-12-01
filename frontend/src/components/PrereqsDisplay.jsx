import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { AiOutlineClose } from "react-icons/ai";
const PrereqsDisplay = ({
  prerequisites,
  removePrerequisite,
  viewOnly,
  user,
}) => {
  return (
    <div className="w-full h-64 overflow-y-scroll ">
      {prerequisites && prerequisites.length > 0 ? (
        <ListGroup>
          {prerequisites.map((prereq, index) => {
            return (
              <ListGroup.Item
                key={index}
                style={{
                  padding: "1rem",
                  width: "90%",
                  borderRadius: "10px",
                  marginTop: 8,
                  color: "black",
                  background: "white",
                  opacity: 0.9,
                  border: "2px solid darkred",
                  borderRadius: 50,
                }}
              >
                {user ? (
                  <div className="row p-2">
                    {prereq.credits === prereq.courses.length * 3
                      ? prereq.courses.join(", ")
                      : prereq.description}
                  </div>
                ) : (
                  <>
                    {!viewOnly && (
                      <AiOutlineClose
                        className="absolute top-5 right-5 text-danger cursor-pointer"
                        size={25}
                        onClick={() => {
                          if (removePrerequisite) {
                            removePrerequisite(index);
                          } else {
                            return;
                          }
                        }}
                      />
                    )}
                    <>
                      <div className="flex  w-100">
                        <span>Credits: {prereq.credits} </span>
                      </div>

                      <div className="row p-2">
                        Courses: {prereq.courses.join(", ")}
                      </div>
                      <div className="row p-2">
                        Description: {prereq.description}
                      </div>
                    </>
                  </>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <h4 className="text-center">No Pre-requisites to display yet</h4>
      )}
    </div>
  );
};

export default PrereqsDisplay;
