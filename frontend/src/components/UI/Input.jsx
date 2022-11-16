import React from "react";
import styles from "../../styles/Login.module.css";

const Input = ({ name, placeholder, value, handleChange, label, type }) => {
  return (
    <div className={`mt-1 mb-3`}>
      {label && <label className="font-semibold text-lg">{label}</label>}
      <input
        className={styles.input2}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
      />
    </div>
  );
};

export default Input;
