import styles from "./DetailsHidden.module.css";

const DetailsHidden = ({ DName }) => {
  return (
    <section className={styles["details-hidden"]}>
      <p className={styles.hint}>
        Click on “Details” to show {DName} details.
      </p>
    </section>
  );
};

export default DetailsHidden;
