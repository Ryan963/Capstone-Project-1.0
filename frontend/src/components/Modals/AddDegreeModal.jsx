import React, { useEffect } from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axios from "axios";
import {useRef} from 'react';

const AddDegreeModal = ({
  close,
  show,
  getDegreesInModal //This hook updates the main page info
}) => {
    let degreeName = '';

    const degreeInput = useRef(null);

    //An empty requirement that will be used for "requirement" field of the degree
    const emptyRequirement = {"type": "credits_of_group",
        "description": "",
        "courses": [],
        "credits": 0}

    const [allDegrees, setAllDegrees] = useState([]);

    //Get all the degrees - will be used for the loop to check if a degree already exists
    
    const token = localStorage.getItem("token");

    useEffect(() => {
      const retrieveDegrees = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        await axios
        .get(`${process.env.REACT_APP_SERVER_API}/degree`, config)
        .then((res) => {
            setAllDegrees(res.data);
        })
        .catch((err) => {
            console.log(err);
            toast.err(err.message);
        });
      };
      retrieveDegrees();
    }, []);


    const handleSubmit = (e) => {
        degreeName = degreeInput.current.value;
        //Check degrees for duplicates
        //If a duplicate is found show alert
        let degreeDuplicate = false;
        for (let i in allDegrees) {
          console.log("degreeName: " + degreeName + " allDegrees " + JSON.stringify(allDegrees[i].name));
            if(degreeName === allDegrees[i].name){
              alert("Degree exists");
              degreeDuplicate = true;
              break;
            }
        }
        
        //If no duplicate then add to database
        if(degreeDuplicate === false){
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .post(
            `${process.env.REACT_APP_SERVER_API}/degree`,
            {"name":degreeName, "requirement": emptyRequirement}, config
          )
          .then((res) => {
            let status = parseInt(JSON.stringify(res.status));
            if((status >= 200) && (status < 300)){
              toast.success("Degree added successfully!");
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

    return (
    <>
    <div className="container">
      <Modal
        show={show}
        size="lg"
        scrollable={true}
        //Locks background
        data-backdrop="static"
        data-keyboard="false"
      >
        <Modal.Header>
          <Modal.Title>Add A Degree</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <div style={{minHeight: 300,}}>
            <label className="font-semibold text-lg">
                Enter the Degree Name:
            </label>
            <div>
                <input
                    ref={degreeInput}
                    type="text"
                    name="degreeName"
                    placeholder="Degree Name"
                />
            </div>
        </div>
        </Modal.Body> 

        <Modal.Footer>
          <Button
            className="btn"
            variant="danger"
            onClick={() => {
              close();
              //Uses the function passed in to update main page once the close button is clicked
              getDegreesInModal();
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

export default AddDegreeModal;
