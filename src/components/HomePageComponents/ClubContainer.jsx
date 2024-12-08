import "./ClubContainer.css"; // Import CSS file for styling

const ClubContainer = ({ image, title, description }) => {
  return (
    <div className="boxes">
      <img src={image} alt="Box Image" className="box-images" />
      <div className="box-content">
        <h2 className="box-titles">{title}</h2>
        <p className="box-descriptions">{description}</p>
      </div>
    </div>
  );
};

export default ClubContainer;
