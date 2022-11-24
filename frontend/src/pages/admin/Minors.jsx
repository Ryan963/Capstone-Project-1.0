import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import RequirementsViewModal from "../../components/Modals/RequirementsViewModal";
import AddRequirementModal from "../../components/Modals/AddRequirementModal";
import UpdateRequirementModal from "../../components/Modals/UpdateRequirementModal";
import AddMajorMinorModal from "../../components/Modals/AddMajorMinorModal";
import DeleteObjectModal from "../../components/Modals/DeleteObjectModal";
import useMinors from "../../hooks/useMinors";
const Minors = () => {
  const [minors, setMinors] = useMinors();
  const [currentMinor, setCurrentMinor] = useState({});
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
  const [showAddMajorMinorModal, setShowAddMajorMinorModal] = useState(false);
  const [showDeleteObjectModal, setShowDeleteObjectModal] = useState(false);

  const addRequirementToMinor = (minorName, requirement) => {
    const minorsCopy = [...minors];
    // find index of this minor
    let idx = 0;
    for (let i = 0; i < minorsCopy.length; i++) {
      if (minorsCopy[i].name === minorName) {
        idx = i;
        break;
      }
    }
    // copy nested objects and lists
    const minor = {
      ...minorsCopy[idx],
      requirements: [...minorsCopy[idx].requirements, requirement],
    };
    minorsCopy[idx] = minor;
    setMinors(minorsCopy);
  };

  const updateRequirementInMinor = (
    minorName,
    oldRequirement,
    newRequirement
  ) => {
    const minorsCopy = [...minors];
    // find index of this minor
    let idx = 0;
    for (let i = 0; i < minorsCopy.length; i++) {
      if (minorsCopy[i].name === minorName) {
        idx = i;
        break;
      }
    }

    // update requirement in minorsCopy
    for (let req in minorsCopy[idx].requirements) {
      if (
        oldRequirement.type === minorsCopy[idx].requirements[req].type &&
        oldRequirement.credits === minorsCopy[idx].requirements[req].credits &&
        oldRequirement.courses === minorsCopy[idx].requirements[req].courses &&
        oldRequirement.description ===
          minorsCopy[idx].requirements[req].description
      ) {
        minorsCopy[idx].requirements[req] = newRequirement;
        break;
      }
    }

    setMinors(minorsCopy);
  };

  const deleteMinor = (minor) => {
    const updatedMinors = minors.filter((m) => m !== minor);
    setMinors(updatedMinors);
  };

  const deleteRequirement = (index) => {
    const id = currentMinor._id;
    setCurrentMinor({
      ...currentMinor,
      requirements: currentMinor.requirements.filter(
        (req, idx) => idx !== index
      ),
    });
    setMinors((prevMinors) => {
      let minorCopy = [...prevMinors];
      minorCopy = minorCopy.map((minor) => {
        if (minor._id === id) {
          let newMinor = {
            ...minor,
            requirements: minor.requirements.filter(
              (req, idx) => idx !== index
            ),
          };
          return newMinor;
        } else {
          return minor;
        }
      });
      return minorCopy;
    });
  };
  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"minors"} />
      </div>
      <div className="ml-20 w-full mr-20">
        {minors.length > 0 ? (
          <>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div className="font-semibold ml-12">
                <span>Minor ID</span>
              </div>
              <div className="font-semibold ml-40">
                <span>Name</span>
              </div>
              <div className="align-center text-end ml-auto mr-10">
                <Button
                  variant="success"
                  onClick={() => setShowAddMajorMinorModal(true)}
                >
                  New Minor
                </Button>
                <AddMajorMinorModal
                  minorOrMajor="Minor"
                  show={showAddMajorMinorModal}
                  close={() => setShowAddMajorMinorModal(false)}
                />
              </div>
            </div>
            <div>
              {minors.map((minor, idx) => {
                return (
                  <div
                    key={minor._id}
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
                      <span>{minor._id}</span>
                    </div>
                    <div className="ml-10">
                      <span className="font-bold">{minor.name}</span>
                    </div>
                    <div className="align-center text-end ml-auto mr-10">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          More
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setShowRequirementsModal(true);
                              setCurrentMinor(minor);
                            }}
                          >
                            View Requirements
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setCurrentMinor(minor);
                              setShowDeleteObjectModal(true);
                            }}
                          >
                            Delete minor
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
        collection={"minor"}
        name={currentMinor.name}
        requirements={currentMinor.requirements}
        deleteRequirementFromState={deleteRequirement}
        showAddRequirementsModal={() => {
          setShowRequirementsModal(false);
          setShowAddRequirementModal(true);
        }}
        showUpdateRequirementsModal={(requirement) => {
          setCurrentRequirement(requirement);
          setShowUpdateRequirementModal(true);
        }}
      />
      <AddRequirementModal
        show={showAddRequirementModal}
        close={() => setShowAddRequirementModal(false)}
        addRequirementToCollection={addRequirementToMinor}
        collection={"minor"}
        name={currentMinor.name}
      />
      <UpdateRequirementModal
        show={showUpdateRequirementModal}
        close={() => setShowUpdateRequirementModal(false)}
        oldRequirement={currentRequirement}
        updateRequirementInCollection={updateRequirementInMinor}
        collection={"minor"}
        name={currentMinor.name}
      />
      <DeleteObjectModal
        show={showDeleteObjectModal}
        close={() => setShowDeleteObjectModal(false)}
        object={currentMinor}
        collection={"minors"}
        deleteFromCollection={deleteMinor}
      />
    </div>
  );
};

export default Minors;
