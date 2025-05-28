import React from "react";
import BoxComponent from "./BoxComponent"; // Import the BoxComponent
import "./ClubsSection.css"; // Import CSS file for styling
import P1 from "../../assets/pic1.png";
import P2 from "../../assets/pic2.png";
import P3 from "../../assets/pic3.png";
import P4 from "../../assets/pic4.png";
import P5 from "../../assets/pic5.png";
import P6 from "../../assets/pic6.png";
import TitleDescription from "./TitleDescription";
import { useTranslation } from "react-i18next";

const ClubsSection = () => {
  const { t } = useTranslation();

  const clubsData = [
    {
      image: P1,
      title: t("home.club-sec.club-1.title"),
      description: t("home.club-sec.club-1.desc"),
    },
    {
      image: P2,
      title: t("home.club-sec.club-2.title"),
      description: t("home.club-sec.club-2.desc"),
    },
    {
      image: P3,
      title: t("home.club-sec.club-3.title"),
      description: t("home.club-sec.club-3.desc"),
    },
    {
      image: P4,
      title: t("home.club-sec.club-4.title"),
      description: t("home.club-sec.club-4.desc"),
    },
    {
      image: P5,
      title: t("home.club-sec.club-5.title"),
      description: t("home.club-sec.club-5.desc"),
    },
    {
      image: P6,
      title: t("home.club-sec.club-6.title"),
      description: t("home.club-sec.club-6.desc"),
    },
  ];

  return (
    <div className="clubs-section">
      <TitleDescription
        title={t("home.club-sec.clubs")}
        description={t("home.club-sec.desc")}
      />
      <div className="clubs-container">
        {clubsData.map((club, index) => (
          <BoxComponent
            key={index}
            image={club.image}
            title={club.title}
            description={club.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ClubsSection;
