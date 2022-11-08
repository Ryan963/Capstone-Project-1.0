import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/courses`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  }, []);
  return [courses, setCourses];
};

export default useCourses;
