import React from "react";
import styles from "./Footer.module.css";
import Bottom from "../../assets/belowfooter.png";
import map from "../../assets/map.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const handleMapClick = () => {
    window.location.href =
      "https://maps.google.com/?q=Altunizade, Üniversite Sok. No:14, 34662 Üsküdar/İstanbul";
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <h3 className={styles.locz}>{t("home.footer.title")}</h3>
        <div className={styles.location} onClick={handleMapClick}>
          <div className={styles.mapBox}>
            <img src={map} alt="Footer Image" className={styles.mapBox} />
          </div>
          <p className={styles.desci}>
            Altunizade, Üniversite Sok. No:14, 34662 Üsküdar/İstanbul
          </p>
        </div>
      </div>

      <div className={styles.footerSection}>
        <h3 id="contact-us">{t("home.footer.contact-us")}</h3>
        <p className={styles.desci}>
          {t("home.footer.contact")}: contact@uskudar.edu.tr
        </p>
      </div>

      {/* 
      <div className={styles.footerSection}>
        <h3>Subscribe</h3>
        <div className="social-icons">
          <i className="fab fa-tiktok"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-youtube"></i>
        </div>
      </div>
      */}

      <img src={Bottom} alt="Footer Image" className={styles.footerImage} />
    </footer>
  );
};

export default Footer;
