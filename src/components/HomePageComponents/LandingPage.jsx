import Navbar from "./Navbar";
import Bottombar from "./Bottombar";
import ClubsSection from "./ClubSection";
import ClubPreview from "./ClubPreview";
import Footer from "./Footer";

import Rectangle from "../../assets/Rectangle.png";
import FirstImage from "../../assets/Firstbg.png";
import Greenlayer from "../../assets/box.png";
import M1 from "../../assets/Music1.png";
import M2 from "../../assets/Music2.png";
import M3 from "../../assets/Music3.png";
import M4 from "../../assets/Music4.png";

import { useTranslation } from "react-i18next";

import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.landingPage}>
      <div className={styles.content}>
        <img src={FirstImage} alt="First Image" className={styles.firstImage} />
        <div className={styles.overlay}>
          <Navbar />
        </div>
        <h1 className={styles.text1}>{t("home.title")}</h1>
      </div>

      <div className={styles.bottombar}>
        <Bottombar />
      </div>

      {/* Additional content */}
      <img
        src={Rectangle}
        alt="Additional Image"
        className={styles.additionalImage}
      />
      <img src={Greenlayer} alt="Green Layer" className={styles.greenLayer} />

      <h1 className={styles.text2}>{t("home.title-sec")}</h1>

      <div className={styles.musicConglomerate}>
        <div className={styles.musicRow}>
          <img src={M1} alt="Music 1" className={styles.music} />
          <img src={M2} alt="Music 2" className={styles.music} />
        </div>
        <div className={styles.musicRow}>
          <img src={M3} alt="Music 3" className={styles.music} />
          <img src={M4} alt="Music 4" className={styles.music} />
        </div>
      </div>

      <div id="home-clubs-list" />
      <ClubsSection />
      <div id="home-events-list" />
      <ClubPreview />
      <Footer />
    </div>
  );
};

export default LandingPage;
