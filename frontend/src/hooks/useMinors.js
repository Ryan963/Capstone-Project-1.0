import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useMinors = () => {
  const [minors, setMinors] = useState([]);
  useEffect(() => {
    getMinors();
  }, []);

  const getMinors = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/minors`)
      .then((res) => {
        setMinors(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };
  return [minors, setMinors];
};

export default useMinors;
