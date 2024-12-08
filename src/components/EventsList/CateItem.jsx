/* eslint-disable react/prop-types */
import styles from "./CateItem.module.css";

const CateItem = ({ className, cateName }) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>{cateName}</div>
  );
};

export default CateItem;
