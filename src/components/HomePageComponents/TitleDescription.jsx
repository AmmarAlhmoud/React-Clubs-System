import styles from "./TitleDescription.module.css";
// import Bbar from "../../assets/SearchBar.png"; // Uncomment if you use the search area

const TitleDescription = ({ title, description }) => {
  return (
    <div className={styles.titleDescription}>
      <div className={styles.textContent}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      {/* Uncomment if you want to add search area
      <div className={styles.searchArea}>
        <input type="text" placeholder="Search anything ...." />
        <i className="fas fa-search"></i>
        <img src={Bbar} alt="search" className={styles.searchbaricon1} />
      </div>
      */}
    </div>
  );
};

export default TitleDescription;
