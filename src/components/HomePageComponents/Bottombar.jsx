import React from "react";
import "./Bottombar.css"; // Import CSS file for styling
import Bottombar1 from "../../assets/bottombar1.png";
import Bottombar2 from "../../assets/bottombar2.png";
import Bottombar3 from "../../assets/bottombar3.png";
import { useTranslation } from "react-i18next";

const Bottombar = () => {
  const { t } = useTranslation();

  return (
    <nav className="Bottombars">
      <div className="BottomBar-item">
        <img
          src={Bottombar1}
          alt="Uskudar University Logo"
          className="Bottombarimg"
        />
        <div className="bottomtext">
          <h2>{t("home.bottom-bar.diverse")}</h2>
          <p>
            <a href="#">{t("home.bottom-bar.learn")}</a>
          </p>
        </div>
      </div>
      <div className="BottomBar-item">
        <img
          src={Bottombar2}
          alt="Uskudar University Logo"
          className="Bottombarimg"
        />
        <div className="bottomtext">
          <h2>{t("home.bottom-bar.fun")}</h2>
          <p>
            <a href="#">{t("home.bottom-bar.learn")}</a>
          </p>
        </div>
      </div>

      <div className="BottomBar-item">
        <img
          src={Bottombar3}
          alt="Uskudar University Logo"
          className="Bottombarimg"
        />
        <div className="bottomtext">
          <h2>{t("home.bottom-bar.craft")}</h2>
          <p>
            <a href="#">{t("home.bottom-bar.learn")}</a>
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Bottombar;
