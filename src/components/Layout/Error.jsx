import React from "react";
import { Link } from "react-router-dom";

import styles from "./Error.module.css";

const Error = () => {
  return (
    <div className={styles.layout}>
      <section className={styles["layout-main-container"]}>
        <section className={styles["main-content"]}>
          <div className={styles["error-container"]}>
            <h1>Oops!</h1>
            <h2>404 - PAGE NOT FOUND</h2>
            <p>
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link to="/" className={styles.button}>
              Home Page
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Error;
