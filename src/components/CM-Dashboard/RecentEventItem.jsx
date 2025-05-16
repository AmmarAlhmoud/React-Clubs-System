import { Link } from "react-router-dom";
import styles from "./RecentEventItem.module.css";

const RecentEventItem = ({ item }) => {
  const { clubName, clubIcon, event } = item;

  const formattedDate = new Date(event?.Date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const bgSrc = event?.EventImage;
  const iconSrc = clubIcon;

  const trimDescription = (desc) => {
    const trimDesk = desc?.trim()?.substring(0, 105);
    if (trimDesk.length === 105) {
      return trimDesk + "...";
    }

    return trimDesk;
  };

  return (
    <div className={styles.card}>
      <img src={bgSrc} alt="Event background" className={styles.bgImg} />

      <div className={styles.header}>
        <img src={iconSrc} alt={`${clubName} icon`} className={styles.icon} />

        <div className={styles.info}>
          <div className={styles.meta}>
            <h2 className={styles.clubName}>{clubName}</h2>
            <span className={styles.date}>{formattedDate}</span>
            <span className={styles.dot} />
            <span className={styles.location}>{event?.location?.label}</span>
          </div>
        </div>

        <Link
          to={`/clubs-list/club-page/${event?.clubId}`}
          className={styles.button}
        >
          Club Page
        </Link>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{event?.EventName}</h3>
        <p className={styles.description}>
          {trimDescription(event?.description)}
        </p>
      </div>
    </div>
  );
};

export default RecentEventItem;
