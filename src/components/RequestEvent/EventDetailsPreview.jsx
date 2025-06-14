import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { eventsActions } from "../../store/events-slice";

import Image from "../UI/Image";
import CateList from "./../EventsList/CateList";
import CateItem from "./../EventsList/CateItem";

import CMIcon from "./../../assets/icons/EventsList/club_manager_logo.png";
import Background_Placeholder from "./../../assets/background_placeholder.png";

import styles from "./EventDetailsPreview.module.css";

const EventDetailsPreview = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    CName,
    clubManager,
    clubIcon,
    EventName,
    location,
    Date: EventDate,
    managerEmail,
    ContactNumber,
    Stime,
    Etime,
    Speakers,
    EventImage,
    clubCategories,
    description,
    type,
  } = data;

  const parsedDate = new Date(EventDate || "");
  let formattedDate = "";

  if (parsedDate.toString() !== "Invalid Date") {
    formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const month = formattedDate.split(" ")[0];
    formattedDate = formattedDate.replace(month, t(`months.${month}`));
  }

  useEffect(() => {
    // if the component unmout/exit from dom return will run
    return () => {
      // Reset state when route changes
      dispatch(eventsActions.setSelectedDate(null));
      dispatch(eventsActions.setSelectedEndingTime(null));
      dispatch(eventsActions.setSelectedStartingTime(null));
      dispatch(eventsActions.setSelectedLocation(null));
    };
  }, [dispatch]);

  return (
    <section className={`${styles["event-details"]}`}>
      <div className={`${styles["event-image"]}`}>
        <Image src={EventImage || Background_Placeholder} alt="Event image" />
      </div>
      <div className={styles["event-title"]}>
        <h3>{t("events-list.event-details.title")}</h3>
        <div>
          <h4>{EventName || ""}</h4>
          {type !== "event-request" && (
            <CateList>
              {clubCategories &&
                clubCategories?.map((cate) => (
                  <CateItem
                    key={cate?.label}
                    cateName={t(`cate-list-value.${cate?.value}`)}
                  />
                ))}
            </CateList>
          )}
        </div>
      </div>
      <p className={styles["event-desc"]}>{description || ""}</p>
      <div className={styles["event-desc-container"]}>
        <span>
          {t("events-list.event-details.speakers")}{" "}
          <span>{Speakers || ""}</span>
        </span>
        <div className={styles["event-desc-container-in"]}>
          <div className={styles.left}>
            <div className={styles["logo-with-name"]}>
              <img
                className={styles["club-img"]}
                src={clubIcon || ""}
                alt={CName || "" + "club logo"}
              />
              <p>{CName}</p>
            </div>
            <div className={styles["logo-with-name"]}>
              <img
                className={styles["club-img"]}
                src={CMIcon || ""}
                alt={CMIcon || "User Logo"}
              />
              <p>{clubManager || ""}</p>
            </div>
          </div>
          <div className={styles.right}>
            <div>
              {t("events-list.event-details.starting-time")}
              <span className={styles["event-span"]}>
                {" "}
                {Stime?.label || ""}
              </span>
            </div>
            <div>
              {t("events-list.event-details.ending-time")}
              <span className={styles["event-span"]}>
                {" "}
                {Etime?.label || ""}
              </span>
            </div>
            <div>
              {t("events-list.event-details.date")}
              <span className={styles["event-span"]}>
                {" "}
                {formattedDate || ""}
              </span>
            </div>
            <div>
              {t("events-list.event-details.location")}
              <span className={styles["event-span"]}>
                {location?.label || ""}
              </span>
            </div>
            <div>
              {t("events-list.event-details.email")}
              <span className={styles["event-span"]}>{managerEmail || ""}</span>
            </div>
            <div>
              {t("events-list.event-details.contact")}
              <span className={styles["event-span"]}>
                {" "}
                {ContactNumber || ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPreview;
