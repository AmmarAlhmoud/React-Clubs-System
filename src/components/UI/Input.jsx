/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import { motion } from "framer-motion";

import styles from "./Input.module.css";

const Input = forwardRef(
  ({ id, label, input, className, container, scaleY, children }, ref) => {
    return (
      <div className={`${styles.input} ${className || ""} `}>
        {label && <label htmlFor={input.id}>{label}</label>}
        <div className={`${styles["input-container"]} ${container || ""} `}>
          {children}
          <motion.input
            autoComplete="off"
            className={id ? styles.search : ""}
            whileFocus={{ scaleY: scaleY || 1.1 }}
            transition={{ type: "spring", duration: 0.5 }}
            {...input}
            ref={ref}
          />
        </div>
      </div>
    );
  }
);

export default Input;
