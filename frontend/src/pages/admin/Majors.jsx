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
import useMajors from "../../hooks/useMajors";

const Majors = () => {
  const [majors, setMajors] = useMajors;
  const [currentMajor, setCurrentMajor] = useState({});
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

  const addRequirementToMajor = (majorName, requirement) => {
    const majorsCopy = [...majors];
    // find index of this major
    let idx = 0;
    for (let i = 0; i < majorsCopy.length; i++) {
      if (majorsCopy[i].name === majorName) {
        idx = i;
        break;
      }
    }
    // copy nested objects and lists
    const major = {
      ...majorsCopy[idx],
      requirements: [...majorsCopy[idx].requirements, requirement],
    };
    majorsCopy[idx] = major;
    setMajors(majorsCopy);
  };
  const updateRequirementInMajor = (
    majorName,
    oldRequirement,
    newRequirement
  ) => {
    const majorsCopy = [...majors];
    // find index of this major
    let idx = 0;
    for (let i = 0; i < majorsCopy.length; i++) {
      if (majorsCopy[i].name === majorName) {
        idx = i;
        break;
      }
    }
    // update requirement in majorsCopy
    for (let req in majorsCopy[idx].requirements) {
      if (
        oldRequirement.type === majorsCopy[idx].requirements[req].type &&
        oldRequirement.credits === majorsCopy[idx].requirements[req].credits &&
        oldRequirement.courses === majorsCopy[idx].requirements[req].courses &&
        oldRequirement.description ===
          majorsCopy[idx].requirements[req].description
      ) {
        majorsCopy[idx].requirements[req] = newRequirement;
        break;
      }
    }
    setMajors(majorsCopy);
  };

  const deleteMajor = (major) => {
    const updatedMajors = majors.filter((m) => m !== major);
    setMajors(updatedMajors);
  };

  const deleteRequirement = (index) => {
    const id = currentMajor._id;
    setCurrentMajor({
      ...currentMajor,
      requirements: currentMajor.requirements.filter(
        (req, idx) => idx !== index
      ),
    });
    setMajors((prevMajors) => {
      let majorCopy = [...prevMajors];
      majorCopy = majorCopy.map((major) => {
        if (major._id === id) {
          const newMajor = {
            ...major,
            requirements: major.requirements.filter(
              (req, idx) => idx !== index
            ),
          };
          return newMajor;
        } else {
          return major;
        }
      });
      return majorCopy;
    });
  };
  return (
    <div className="flex flex-row w-full">
      <div>
        <AdminSidebar route={"majors"} />
      </div>
      <div className="ml-20 w-full mr-20">
        {majors.length > 0 ? (
          <>
            <div
              className={`flex mt-1 p-3 items-center rounded-3xl border bg-lightgrey text-grey`}
            >
              <div className="font-semibold w-60 text-center">
                <span>Major ID</span>
              </div>
              <div className="font-semibold w-60 ml-10 ">
                <span>Name</span>
              </div>
              <div className="font-semibold w-48">
                <span>Stream</span>
              </div>
              <div className="align-center text-end ml-auto mr-10">
                <Button
                  variant="success"
                  onClick={() => setShowAddMajorMinorModal(true)}
                >
                  New Major
                </Button>
                <AddMajorMinorModal
                  minorOrMajor="Major"
                  show={showAddMajorMinorModal}
                  close={() => setShowAddMajorMinorModal(false)}
                />
              </div>
            </div>
            <div>
              {majors
                .sort((a, b) => {
                  if (a.name > b.name) {
                    return 1;
                  } else if (a.name < b.name) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
                .map((major, idx) => {
                  return (
                    <div
                      key={major._id}
                      className={`flex mt-1 p-3 items-center rounded-3xl border  ${
                        idx % 2 === 1 ? "bg-lightblue2" : ""
                      }`}
                    >
                      <div
                        className="w-60"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span>{major._id}</span>
                      </div>
                      <div className="ml-10 w-60">
                        <span className="font-bold">{major.name}</span>
                      </div>
                      <div>
                        <span className="font-bold ">
                          {major.stream ? major.stream : "N/A"}
                        </span>
                      </div>
                      <div className="align-center text-end ml-auto mr-10">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            More
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                setCurrentMajor(major);
                                setShowRequirementsModal(true);
                              }}
                            >
                              View Requirements
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setCurrentMajor(major);
                                setShowDeleteObjectModal(true);
                              }}
                            >
                              Delete Major
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
        collection={"major"}
        stream={currentMajor.stream}
        deleteRequirementFromState={deleteRequirement}
        name={currentMajor.name}
        requirements={currentMajor.requirements}
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
        addRequirementToCollection={addRequirementToMajor}
        collection={"major"}
        name={currentMajor.name}
        stream={currentMajor.stream}
      />
      <UpdateRequirementModal
        show={showUpdateRequirementModal}
        close={() => setShowUpdateRequirementModal(false)}
        oldRequirement={currentRequirement}
        updateRequirementInCollection={updateRequirementInMajor}
        collection={"major"}
        name={currentMajor.name}
        stream={currentMajor.stream}
      />
      <DeleteObjectModal
        show={showDeleteObjectModal}
        close={() => setShowDeleteObjectModal(false)}
        object={currentMajor}
        collection={"majors"}
        deleteFromCollection={deleteMajor}
      />
    </div>
  );
};

export default Majors;
