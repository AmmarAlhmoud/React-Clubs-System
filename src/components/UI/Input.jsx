/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { forwardRef } from "react";
import { motion } from "framer-motion";

import Icon from "./Icon";

import Eye_icon from "./../../assets/icons/LO/eye_icon.png";
import EyeSlash_icon from "./../../assets/icons/LO/eye_slash.png";

import styles from "./Input.module.css";

const Input = forwardRef(
  ({ id, label, input, className, container, scaleY, children }, ref) => {
    const [show, setShow] = useState(false);

    let inputType = input.type;

    if (inputType === "password" && show) {
      inputType = "text";
    }

    return (
      <div className={`${styles.input} ${className || ""}`}>
        {label && <label htmlFor={input.id}>{label}</label>}
        <div
          className={`${styles["input-container"]} ${container || ""} ${
            input.type === "password" ? styles.inputPass : ""
          }`}
        >
          {children}
          <motion.input
            autoComplete="off"
            className={id ? styles.search : ""}
            whileFocus={{ scaleY: scaleY || 1.1 }}
            transition={{ type: "spring", duration: 0.5 }}
            {...input}
            type={inputType}
            ref={ref}
          />
          {input.type === "password" && (
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className={styles["show-password-btn"]}
              aria-label={show ? "Hide password" : "Show password"}
            >
              <Icon
                src={!show ? EyeSlash_icon : Eye_icon}
                alt={!show ? "Hide password icon" : "Show password icon"}
                className={styles["show-password-icon"]}
              />
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default Input;
