import React, { useEffect } from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axios from "axios";
import { useRef } from "react";
import styles from "../../styles/Login.module.css";

const AddMajorMinorModal = ({
  minorOrMajor, //Same modal for both
  close,
  show,
  addToCollection,
}) => {
  let majorName = "";
  let minorName = "";
  let majorStream = "";
  const minorMajorInput = useRef(null);
  const streamInput = useRef(null);

  const [allMajors, setAllMajors] = useState([]);
  const [allMinors, setAllMinors] = useState([]);

  //Get all the degrees - will be used for the loop to check if a degree already exists

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (minorOrMajor === "Major") {
      const retrieveMajors = async () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios
          .get(`${process.env.REACT_APP_SERVER_API}/majors`, config)
          .then((res) => {
            setAllMajors(res.data);
          })
          .catch((err) => {
            console.log(err);
            toast.err(err.message);
          });
      };
      retrieveMajors();
    } else {
      const retrieveMinors = async () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios
          .get(`${process.env.REACT_APP_SERVER_API}/minors`, config)
          .then((res) => {
            setAllMinors(res.data);
          })
          .catch((err) => {
            console.log(err);
            toast.err(err.message);
          });
      };
      retrieveMinors();
    }
  }, []);

  const handleSubmit = (e) => {
    if (minorOrMajor === "Major") {
      majorName = minorMajorInput.current.value;
      majorStream = streamInput.current.value;
      //Check Majors for duplicates
      //If a duplicate is found show alert
      let majorDuplicate = false;
      for (let i in allMajors) {
        if (
          majorName === allMajors[i].name &&
          majorStream === allMajors[i].stream
        ) {
          alert("Major exists");
          majorDuplicate = true;
          break;
        }
      }

      //If no duplicate then add to database
      if (majorDuplicate === false) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .post(
            `${process.env.REACT_APP_SERVER_API}/majors`,
            { name: majorName, requirements: [], stream: majorStream },
            config
          )
          .then((res) => {
            if (JSON.stringify(res.status) === "200") {
              addToCollection(res.data);
              setAllMajors([...allMajors, res.data]);
              toast.success("Major added successfully!");
              close();
            } else {
              toast.error(JSON.stringify(res.data.message));
            }
          })
          .catch((error) => {
            toast.error(error.message);
            console.log(error);
          });
      }
    } else {
      minorName = minorMajorInput.current.value;
      //Check Majors for duplicates
      //If a duplicate is found show alert
      let minorDuplicate = false;
      for (let i in allMinors) {
        console.log(
          "minorName: " +
            minorName +
            " allMinors " +
            JSON.stringify(allMinors[i].name)
        );
        if (minorName === allMinors[i].name) {
          alert("Minor exists");
          minorDuplicate = true;
          break;
        }
      }

      //If no duplicate then add to database
      if (minorDuplicate === false) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .post(
            `${process.env.REACT_APP_SERVER_API}/minors`,
            { name: minorName, requirements: [] },
            config
          )
          .then((res) => {
            // console.log(JSON.stringify(res));
            if (JSON.stringify(res.status) === "200") {
              addToCollection(res.data);
              toast.success("Minor added successfully!");
              setAllMinors([...allMinors, res.data]);
              close();
            } else {
              toast.error(JSON.stringify(res.data.message));
            }
          })
          .catch((error) => {
            toast.error(error.message);
            console.log(error);
          });
      }
    }
  };

  return (
    <>
      <div className="container">
        <Modal
          show={show}
          size="md"
          onHide={() => close()}
          scrollable={true}
          //Locks background
          data-backdrop="static"
          data-keyboard="false"
        >
          <Modal.Header>
            <Modal.Title>Add A {minorOrMajor}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div style={{ minHeight: 40 }}>
              <label className="font-semibold text-lg">
                Enter the {minorOrMajor} Name:
              </label>
              <div>
                <input
                  className={styles.input2}
                  ref={minorMajorInput}
                  type="text"
                  name="majorOrMinorName"
                  placeholder="Major or Minor Name"
                />
                {minorOrMajor.toLowerCase() === "major" && (
                  <input
                    className={styles.input2}
                    ref={streamInput}
                    type="text"
                    name="stream"
                    placeholder="Stream"
                  />
                )}
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
            <Button
              className="btn"
              variant="info"
              onClick={() => {
                handleSubmit();
              }}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AddMajorMinorModal;
