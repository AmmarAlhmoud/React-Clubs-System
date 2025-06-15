import styles from "./BoxComponent.module.css";

const BoxComponent = ({ image, title, description }) => {
  return (
    <div className={styles.box}>
      <img src={image} alt="Box Image" className={styles.boxImage} />
      <div className={styles.boxContent}>
        <h2 className={styles.boxTitle}>{title}</h2>
        <p className={styles.boxDescription}>{description}</p>
      </div>
    </div>
  );
};

export default BoxComponent;
