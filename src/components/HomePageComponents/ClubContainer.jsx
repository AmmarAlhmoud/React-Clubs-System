import React from "react";
import styles from "./ClubContainer.module.css";

const ClubContainer = ({ image, title, description }) => {
  return (
    <div className={styles.boxes}>
      <img src={image} alt="Box Image" className={styles.boxImages} />
      <div className={styles.boxContent}>
        <h2 className={styles.boxTitles}>{title}</h2>
        <p className={styles.boxDescriptions}>{description}</p>
      </div>
    </div>
  );
};

export default ClubContainer;
