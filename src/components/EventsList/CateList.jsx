/* eslint-disable react/prop-types */

import styles from "./CateList.module.css";

const CateList = ({ className, children }) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>{children}</div>
  );
};

export default CateList;
