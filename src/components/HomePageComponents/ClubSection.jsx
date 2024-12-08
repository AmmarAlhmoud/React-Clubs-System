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

const ClubsSection = () => {
  const clubsData = [
    { image: P1, title: "Babycare Club", description: "Oh my God!" },
    { image: P2, title: "Chemicals Club", description: "who cares mf" },
    { image: P3, title: "UU AFAD Club", description: "i hate programming" },
    { image: P4, title: "Adventure Time Club", description: "css is shit!" },
    { image: P5, title: "Dance Club", description: "i am exhausted" },
    { image: P6, title: "Chess Club", description: "can't wait" },
  ];

  return (
    <div className="clubs-section">
      <TitleDescription
        title="clubs"
        description="wide variety of clubs viewing from Most popular"
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
