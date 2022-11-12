import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const useUser = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { email },
    };
    axios
      .get(
        `${process.env.REACT_APP_SERVER_API}/user/me`,

        config
      )
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  }, []);

  return [user, setUser];
};

export default useUser;
