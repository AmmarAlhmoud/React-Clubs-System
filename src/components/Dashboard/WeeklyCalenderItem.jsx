import styles from "./WeeklyCalenderItem.module.css";

const WeeklyCalenderItem = ({
  name,
  location,
  clubName,
  clubLogo,
  startTime,
  endTime,
}) => {
  return (
    <div className={styles.eventItem}>
      <div>
        <p>{name}</p>
        <span>{startTime}</span>
      </div>
      <div>
        <span>{endTime}</span>
      </div>
      <div>
        <h1>{location}</h1>
      </div>
      <div>
        <h2>{clubName}</h2>
      </div>
      <img src={clubLogo} alt="club icon" />
    </div>
  );
};

export default WeeklyCalenderItem;
