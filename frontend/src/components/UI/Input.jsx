import React from "react";
import styles from "../../styles/Login.module.css";

const Input = ({ name, placeholder, value, handleChange }) => {
  return (
    <div className={`mt-1 mb-3`}>
      <label className="font-semibold text-lg">Enter Number of Credits:</label>
      <input
        className={styles.input2}
        onChange={handleChange}
        type="number"
        placeholder={placeholder}
        name={name}
        value={value}
      />
    </div>
  );
};

export default Input;
