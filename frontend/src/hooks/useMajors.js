import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const useMajors = () => {
  const [majors, setMajors] = useState([]);
  useEffect(() => {
    //Moved to separate function so I can call function in modal and update main page
    getMajors();
  }, []);

  const getMajors = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/majors`)
      .then((res) => {
        console.log(res.data);
        setMajors(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };
  return [majors, setMajors];
};

export default useMajors;
