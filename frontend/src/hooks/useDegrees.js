import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useDegrees = () => {
  const [Degrees, setDegrees] = useState([]);

  //Get all the degrees - will be used for the loop to check if a degree already exists

  useEffect(() => {
    const retrieveDegrees = async () => {
      await axios
        .get(`${process.env.REACT_APP_SERVER_API}/degree`)
        .then((res) => {
          setDegrees(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.err(err.message);
        });
    };
    retrieveDegrees();
  }, []);
  return [Degrees, setDegrees];
};

export default useDegrees;
