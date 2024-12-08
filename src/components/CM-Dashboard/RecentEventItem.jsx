import { Link } from "react-router-dom";

import styles from "./RecentEventItem.module.css";

const RecentEventItem = ({ clubName, clubIcon, event }) => {
  const formattedDate = new Date(event?.Date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className={styles.eventItem}>
      <img src={event.EventImage} alt="event image" />
      <img src={clubIcon} alt="icon" />
      <div>
        <h1>{clubName}</h1>
        <h2>{formattedDate}</h2>
        <h2>{event?.location?.label}</h2>
      </div>
      <div>
        <h3>{event.title}</h3>
        {/* <Link to="/my-club">
          <button className={styles.btn}>Club Page</button>
        </Link> */}
      </div>
      <p>{event.description}</p>
    </div>
  );
};

export default RecentEventItem;
