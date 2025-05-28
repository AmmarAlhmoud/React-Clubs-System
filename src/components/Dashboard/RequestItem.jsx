import styles from "./RequestItem.module.css";
import { useTranslation } from "react-i18next";

const RequestItem = ({ name, icon, type, reqDate }) => {
  const { t } = useTranslation();

  // button color
  let btnClass = null;
  if (type === "event-request") {
    btnClass = styles.lighPink;
  } else if (type === "edit-event") {
    btnClass = styles.pink;
  } else if (
    type === "post-request" ||
    type === "edit-club" ||
    type === "edit-post"
  ) {
    btnClass = styles.purple;
  } else {
    btnClass = styles.purple;
  }

  let formattedDate = new Date(reqDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const month = formattedDate.split(" ")[0];
  formattedDate = formattedDate.replace(month, t(`months.${month}`));

  const time = new Date(reqDate);

  const hours = time.getHours();
  const minutes = time.getMinutes();

  let reqType;

  if (type === "event-request") {
    reqType = "Event";
  }
  if (type === "post-request") {
    reqType = "Post";
  }
  if (type === "edit-event") {
    reqType = "Edit Event";
  }
  if (type === "edit-post") {
    reqType = "Edit Post";
  }
  if (type === "edit-club") {
    reqType = "Edit Club";
  }

  return (
    <div className={styles.reqItem}>
      <header>
        <img src={icon} alt="club icon" />
        <h2>{name}</h2>
      </header>
      <h3>{t("dashboard.request-date")}</h3>
      <footer>
        <span>{`${hours}:${minutes}`}</span>
        <span>{formattedDate}</span>
        <button className={btnClass}>{reqType}</button>
      </footer>
    </div>
  );
};

export default RequestItem;
