/* eslint-disable react/prop-types */

import Button from "./Button";

import styles from "./ColoredButton.module.css";

const ColoredButton = ({ children, className, onClick, red, purble, type, disabled, name }) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      name={name}
      className={`${styles.btn}  ${styles.disabled} ${className} ${red ? styles.red : ""} ${
        purble ? styles.purble : ""
      }`}
      stiffness={100}
      scale={1.05}
    >
      {children}
    </Button>
  );
};

export default ColoredButton;
