import React from "react";
import "./TitleDescription.css"; // Import CSS file for styling
import Bbar from "../../assets/SearchBar.png";

const TitleDescription = ({ title, description }) => {
  return (
    <div className="title-description">
      <div className="text-content">
        <h2 className="title">{title}</h2>
        <p className="description">{description}</p>
      </div>
      {/* <div className="search-area">
        <input type="text" placeholder="Search anything ...." />
        <i className="fas fa-search"></i>
        <img src={Bbar} alt="search" className="searchbaricon1" />
      </div> */}
    </div>
  );
};

export default TitleDescription;
