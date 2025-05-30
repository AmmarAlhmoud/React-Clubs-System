import React from "react";
import "./Footer.css";
import Bottom from "../../assets/belowfooter.png";
import map from "../../assets/map.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const handleMapClick = () => {
    // Handle map click event (redirect to location)
    window.location.href =
      "https://maps.google.com/?q=Altunizade, Üniversite Sok. No:14, 34662 Üsküdar/İstanbul";
  };

  return (
    <footer className="footer">
      <div className="footer-section">
        <h3 className="locz">{t("home.footer.title")}</h3>
        <div className="location" onClick={handleMapClick}>
          <div className="map-box">
            <img src={map} alt="Footer Image" className="map-box" />
          </div>
          <p className="desci">
            Altunizade, Üniversite Sok. No:14, 34662 Üsküdar/İstanbul
          </p>
        </div>
      </div>
      <div className="footer-section">
        <h3 id="contact-us">{t("home.footer.contact-us")}</h3>
        <p className="desci">
          {t("home.footer.contact")}: contact@uskudar.edu.tr
        </p>
      </div>
      {/* <div className="footer-section">
        <h3>Subscribe</h3>
        <div className="social-icons">
          <i className="fab fa-tiktok"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-youtube"></i>
        </div>
      </div> */}
      <img src={Bottom} alt="Footer Image" className="footer-image" />
    </footer>
  );
};

export default Footer;
