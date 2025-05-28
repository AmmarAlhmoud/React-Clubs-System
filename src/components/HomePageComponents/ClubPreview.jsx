import React from "react";
import ClubContainer from "./ClubContainer";
import P1 from "../../assets/img1.png";
import P2 from "../../assets/img2.png";
import P3 from "../../assets/img3.png";
import P4 from "../../assets/img4.png";
import P5 from "../../assets/img5.png";
import P6 from "../../assets/img6.png";
import TitleDescription from "./TitleDescription";
import "./ClubPreview.css";
import { useTranslation } from "react-i18next";

const ClubPreview = () => {
  const { t } = useTranslation();

  const clubsData = [
    {
      image: P1,
      title: t("home.club-prev.club-1.title"),
      description: t("home.club-prev.club-1.desc"),
    },
    {
      image: P2,
      title: t("home.club-prev.club-2.title"),
      description: t("home.club-prev.club-2.desc"),
    },
    {
      image: P3,
      title: t("home.club-prev.club-3.title"),
      description: t("home.club-prev.club-3.desc"),
    },
    {
      image: P4,
      title: t("home.club-prev.club-4.title"),
      description: t("home.club-prev.club-4.desc"),
    },
    {
      image: P5,
      title: t("home.club-prev.club-5.title"),
      description: t("home.club-prev.club-5.desc"),
    },
    {
      image: P6,
      title: t("home.club-prev.club-6.title"),
      description: t("home.club-prev.club-6.desc"),
    },
  ];

  // Split clubsData into chunks of 3
  const clubsChunks = [];
  for (let i = 0; i < clubsData.length; i += 3) {
    clubsChunks.push(clubsData.slice(i, i + 3));
  }

  return (
    <div className="club-section">
      <TitleDescription
        title={t("home.club-prev.events")}
        description={t("home.club-prev.desc")}
      />

      <div className="club-container">
        {clubsChunks.map((chunk, index) => (
          <div className="row" key={index}>
            {chunk.map((club, innerIndex) => (
              <ClubContainer
                key={innerIndex}
                image={club.image}
                title={club.title}
                description={club.description}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubPreview;
