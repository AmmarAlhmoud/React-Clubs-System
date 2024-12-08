/* eslint-disable react/prop-types */
import styles from "./Icon.module.css";

const Icon = ({ className, src, alt, title }) => {
  return (
    <div className={`${title ? styles["with-title"] : ""}`}>
      <img
        className={`${styles.icon} ${className || ""}`}
        src={src}
        alt={alt}
      />
      {title && <p className={styles.p}>{title}</p>}
    </div>
  );
};

export default Icon;
