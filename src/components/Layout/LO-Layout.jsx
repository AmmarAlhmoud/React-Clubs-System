// import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Image from "../UI/Image.jsx";

import styles from "./LO-Layout.module.css";
import Logo from "../../assets/logo.png";
import Girl_img from "../../assets/images/LO/girl_avatar.png";
import Uni_logo from "../../assets/uni_logo.png";
import { useTranslation } from "react-i18next";

const LOLayout = (props) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ width: "100%" }}
      transition={{ type: "tween", duration: 0.2 }}
      className={styles.layout}
    >
      <section className={styles["layout-main-container"]}>
        <main className={styles["main-content"]}>
          <section className={styles["main-container-image"]}>
            <div className={styles.welcome}>{t("welcome")}</div>
            <Image
              className={styles["main-img-logo"]}
              src={Uni_logo}
              alt="background"
            />
            <Image
              className={styles["main-img-girl"]}
              src={Girl_img}
              alt="background"
            />
          </section>
          <section className={styles["main-container-form"]}>
            {props.children}
          </section>
        </main>
      </section>
      <footer className={styles.footer}>
        <p>
          {t("powerd-by")}
          <img
            className={styles["footer-logo"]}
            src={Logo}
            alt="website logo"
          />
          Electric Technology
        </p>
      </footer>
    </motion.div>
  );
};

export default LOLayout;
