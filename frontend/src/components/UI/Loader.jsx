import React from "react";
import { Spinner } from "react-bootstrap";
const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{ width: "3rem", height: "3rem" }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default Loader;
