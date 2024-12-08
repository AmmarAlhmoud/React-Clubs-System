import React from 'react';
import './BoxComponent.css'; // Import CSS file for styling

const BoxComponent = ({ image, title, description }) => {
  return (
    <div className="box">
      <img src={image} alt="Box Image" className="box-image" />
      <div className="box-content">
        <h2 className="box-title">{title}</h2>
        <p className="box-description">{description}</p>
      </div>
    </div>
  );
}

export default BoxComponent;
