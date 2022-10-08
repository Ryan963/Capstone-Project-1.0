import React, { useState } from "react";
import styles from "../styles/Login.module.css";
const AdminLogin = () => {
  const [inputFocus, updateFocus] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleSubmit = () => {};
  return (
    <div className="flex justify-center mt-20 w-screen items-center">
      <form onSubmit={handleSubmit}>
        <div className={`flex-row ${styles.loginContainer} m-2`}>
          <section className={styles.loginHeader}>
            <div className="flex justify-center items-center">
              <span>Admin Login</span>
            </div>
          </section>
          <hr className="m-0" />
          <section>
            <input
              className={styles.input}
              onFocus={() => updateFocus(true)}
              onBlur={() => updateFocus(false)}
              type="email"
              id="floatingInput"
              placeholder="Email Address"
            />

            <input
              className={styles.input}
              onFocus={() => updateFocus(true)}
              onBlur={() => updateFocus(false)}
              type={visible ? "text" : "password"}
              id="floatingPassword"
              placeholder="Password"
            />
          </section>
          <section className={`${styles.loginFooter}  mb-4`}>
            <button
              type="submit"
              disabled={disabled}
              className={disabled ? styles.disabled : ""}
            >
              Login
            </button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
