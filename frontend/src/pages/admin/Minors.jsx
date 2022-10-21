import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AdminSidebar from "../../components/admin/AdminSideBar";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader";
import RequirementsViewModal from "../../components/Modals/RequirementsViewModal";
import AddRequirementModal from "../../components/Modals/AddRequirementModal";

const Minors = () => {
  const [minors, setMinors] = useState([]);
  const [currentMinor, setCurrentMinor] = useState({});
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/minors`, config)
      .then((res) => {
        setMinors(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  }, []);

  const addRequirementToMinor = (minorName, requirement) => {
    const minorsCopy = [...minors];
    // find index of this degree
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
                <span>Degree ID</span>
              </div>
              <div className="font-semibold ml-40">
                <span>Name</span>
              </div>
              <div className="align-center text-end ml-auto mr-10">
                <Button variant="success">New Minor</Button>
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
                          <Dropdown.Item onClick={() => {}}>
                            Update
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setShowRequirementsModal(true);
                              setCurrentMinor(minor);
                            }}
                          >
                            View Requirements
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}}>
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
        showAddRequirementsModal={() => {
          setShowRequirementsModal(false);
          setShowAddRequirementModal(true);
        }}
      />
      <AddRequirementModal
        show={showAddRequirementModal}
        close={() => setShowAddRequirementModal(false)}
        addRequirementToCollection={addRequirementToMinor}
        collection={"minor"}
        name={currentMinor.name}
      />
    </div>
  );
};

export default Minors;
