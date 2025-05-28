import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase";
import { clubActions } from "../../store/club-slice";

import styles from "./RecentEventItem.module.css";
import { useTranslation } from "react-i18next";

const RecentEventItem = ({ item }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const db = database;

  const { clubName, clubIcon, event } = item;

  let formattedDate = new Date(event?.Date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const month = formattedDate.split(" ")[0];
  formattedDate = formattedDate.replace(month, t(`months.${month}`));

  const bgSrc = event?.EventImage;
  const iconSrc = clubIcon;

  const trimDescription = (desc) => {
    const trimDesk = desc?.trim()?.substring(0, 105);
    if (trimDesk.length === 105) {
      return trimDesk + "...";
    }

    return trimDesk;
  };

  const openingClubPageHandler = () => {
    navigate(`/clubs-list/club-page/${event?.clubId}`);
  };

  useEffect(() => {
    const fetchCurrentClub = (clubId) => {
      const starCountRef = ref(db, "/clubslist/" + clubId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setCurrentClubInfo(data));
      });
    };

    if (event?.clubId) {
      fetchCurrentClub(event?.clubId);
    }
  }, [db, dispatch, event?.clubId]);

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

        <a onClick={openingClubPageHandler} className={styles.button}>
          {t("cm-dashboard.club-page")}
        </a>
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
