import React from "react";
import styles from "../../styles/Login.module.css";
const ButtonPrimary = ({ disabled, children, onClick }) => {
  return (
    <section className={`${styles.loginFooter}  mb-4 mt-9`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={disabled ? styles.disabled : ""}
      >
        {children}
      </button>
    </section>
  );
};

export default ButtonPrimary;
