import Navbar from "./Navbar"; // Assuming Navbar component is in Navbar.js
import "./LandingPage.css"; // Import CSS file for styling
import Bottombar from "./Bottombar";
import Rectangle from "../../assets/Rectangle.png";
import FirstImage from "../../assets/Firstbg.png";
import Greenlayer from "../../assets/box.png";
import M1 from "../../assets/Music1.png";
import M2 from "../../assets/Music2.png";
import M3 from "../../assets/Music3.png";
import M4 from "../../assets/Music4.png";
import ClubsSection from "./ClubSection";
import ClubPreview from "./ClubPreview";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <div className="content">
        <img src={FirstImage} alt="First Image" className="first-image" />
        <div className="overlay">
          <Navbar />
        </div>
        <h1 className="text1">{t("home.title")}</h1>
      </div>
      <div className="bottombar">
        <Bottombar />
      </div>

      {/* Add more content below the bottom bar */}
      <img
        src={Rectangle}
        alt="Additional Image"
        className="additional-image"
      />
      <img src={Greenlayer} alt="Image" className="Greenlayer" />
      <h1 className="text2">{t("home.title-sec")}</h1>
      <div className="Music-conglumerate">
        <div className="Music-row">
          <img src={M1} alt="Image" className="music" />
          <img src={M2} alt="Image" className="music" />
        </div>
        <div className="Music-row">
          <img src={M3} alt="Image" className="music" />
          <img src={M4} alt="Image" className="music" />
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
