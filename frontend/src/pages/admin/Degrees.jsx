import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSideBar";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { Button } from "react-bootstrap";
import Loader from "../../components/UI/Loader";
import RequirementsViewModal from "../../components/Modals/RequirementsViewModal";
import AddRequirementModal from "../../components/Modals/AddRequirementModal";
import UpdateRequirementModal from "../../components/Modals/UpdateRequirementModal";
import AddDegreeModal from "../../components/Modals/AddDegreeModal";
import DeleteObjectModal from "../../components/Modals/DeleteObjectModal";
import useDegrees from "../../hooks/useDegrees";

const Degrees = () => {
  const [degrees, setDegrees] = useDegrees();
  const [currentDegree, setCurrentDegree] = useState({});
  const [currentRequirement, setCurrentRequirement] = useState({
    type: "",
    credits: 0,
    course: [],
    description: "",
  });
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false);
  const [showUpdateRequirementModal, setShowUpdateRequirementModal] =
    useState(false);
  const [showAddDegreeModal, setShowAddDegreeModal] = useState(false);
  const [showDeleteObjectModal, setShowDeleteObjectModal] = useState(false);
  const token = localStorage.getItem("token");

  const addRequirementToDegree = (degreeName, requirement) => {
    const degreesCopy = [...degrees];
    // find index of this degree
    let idx = 0;
    for (let i = 0; i < degreesCopy.length; i++) {
      if (degreesCopy[i].name === degreeName) {
        idx = i;
        break;
      }
    }
    // copy nested objects and lists
    const degree = {
      ...degreesCopy[idx],
      requirements: [...degreesCopy[idx].requirements, requirement],
    };
    degreesCopy[idx] = degree;
    setDegrees(degreesCopy);
  };
  const updateRequirementInDegree = (
    degreeName,
    oldRequirement,
    newRequirement
  ) => {
    const degreesCopy = [...degrees];
    // find index of this degree
    let idx = 0;
    for (let i = 0; i < degreesCopy.length; i++) {
      if (degreesCopy[i].name === degreeName) {
        idx = i;
        break;
      }
    }

    // update requirement in degreesCopy
    for (let req in degreesCopy[idx].requirements) {
      if (
        oldRequirement.type === degreesCopy[idx].requirements[req].type &&
        oldRequirement.credits === degreesCopy[idx].requirements[req].credits &&
        oldRequirement.courses === degreesCopy[idx].requirements[req].courses &&
        oldRequirement.description ===
          degreesCopy[idx].requirements[req].description
      ) {
        degreesCopy[idx].requirements[req] = newRequirement;
        break;
      }
    }

    setDegrees(degreesCopy);
  };

  const deleteDegree = (degree) => {
    const updatedDegrees = degrees.filter((d) => d !== degree);
    setDegrees(updatedDegrees);
  };

  const addDegree = (degree) => {
    const updatedDegrees = [...degrees, degree];
    setDegrees(updatedDegrees);
  };

  const deleteRequirement = (index) => {
    const id = currentDegree._id;
    setCurrentDegree({
      ...currentDegree,
      requirements: currentDegree.requirements.filter(
        (req, idx) => idx !== index
      ),
    });
    setDegrees((prevDegrees) => {
      let degreesCopy = [...prevDegrees];
      degreesCopy = degreesCopy.map((degree) => {
        if (degree._id === id) {
          const newDegree = {
            ...degree,
            requirements: degree.requirements.filter(
              (req, idx) => idx !== index
            ),
          };
          return newDegree;
        } else {
          return degree;
        }
      });
      return degreesCopy;
    });
  };
  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"degrees"} />
      </div>
      <div className="ml-20 w-full mr-20">
        {degrees.length > 0 ? (
          <>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div className="font-semibold ml-12">
                <span>Degree ID</span>
              </div>
              <div className="font-semibold ml-40">
                <span>Name</span>
              </div>
              <div className="align-center text-end ml-auto mr-10">
                <Button
                  variant="success"
                  onClick={() => setShowAddDegreeModal(true)}
                >
                  New Degree
                </Button> 

                <AddDegreeModal
                  show={showAddDegreeModal}
                  close={() => setShowAddDegreeModal(false)}
                  addDegreeToCollection={addDegree}
                />
              </div>
            </div>
            <div>
              {degrees.map((degree, idx) => {
                return (
                  <div
                    key={degree._id}
                    className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                      idx % 2 === 1 ? "bg-lightblue2" : ""
                    }`}
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span>{degree._id}</span>
                    </div>
                    <div className="ml-10">
                      <span className="font-bold">{degree.name}</span>
                    </div>
                    <div className="align-center text-end ml-auto mr-10">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          More
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentDegree(degree);
                              setShowRequirementsModal(true);
                            }}
                          >
                            View Requirements
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentDegree(degree);
                              setShowDeleteObjectModal(true);
                            }}
                          >
                            Delete Degree
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
      <RequirementsViewModal
        show={showRequirementsModal}
        close={() => setShowRequirementsModal(false)}
        collection={"degree"}
        name={currentDegree.name}
        requirements={currentDegree.requirements}
        deleteRequirementFromState={deleteRequirement}
        showAddRequirementsModal={() => {
          setShowRequirementsModal(false);
          setShowAddRequirementModal(true);
        }}
        showUpdateRequirementsModal={(requirement) => {
          //setShowRequirementsModal(false);
          setCurrentRequirement(requirement);
          setShowUpdateRequirementModal(true);
        }}
      />
      <AddRequirementModal
        show={showAddRequirementModal}
        close={() => setShowAddRequirementModal(false)}
        addRequirementToCollection={addRequirementToDegree}
        collection={"degree"}
        name={currentDegree.name}
      />
      <UpdateRequirementModal
        show={showUpdateRequirementModal}
        close={() => setShowUpdateRequirementModal(false)}
        oldRequirement={currentRequirement}
        updateRequirementInCollection={updateRequirementInDegree}
        collection={"degree"}
        name={currentDegree.name}
      />
      <DeleteObjectModal
        show={showDeleteObjectModal}
        close={() => setShowDeleteObjectModal(false)}
        object={currentDegree}
        collection={"degree"}
        deleteFromCollection={deleteDegree}
      />
    </div>
  );
};

export default Degrees;
