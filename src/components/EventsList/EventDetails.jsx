import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { eventsActions } from "../../store/events-slice";

import CloseBtn from "../UI/CloseBtn";
import Icon from "../UI/Icon";
import Image from "../UI/Image";
import CateList from "./CateList";
import CateItem from "./CateItem";

import Club_Page_Ic from "../../assets/icons/EventsList/description.png";

import styles from "./EventDetails.module.css";
import { useTranslation } from "react-i18next";

const EventDetails = ({ from, orientation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  let currentEventDetails = {};
  const eventDetails = useSelector((state) => state.events.currentEventDetails);
  const eventReqDetails = useSelector(
    (state) => state.events.currentEventReqDetails
  );

  if (from === "events-list") {
    currentEventDetails = eventDetails;
  }
  if (from === "requests") {
    currentEventDetails = eventReqDetails;
  }

  const {
    id,
    clubId,
    CName,
    CMName,
    CLogo,
    CMLogo,
    EventName,
    EventLocation,
    EventDate,
    CMEmail,
    CMPhone,
    EventSTime,
    EventETime,
    Speakers,
    EventImage,
    clubCategories,
    description,
    type,
  } = currentEventDetails;

  const parsedDate = new Date(EventDate);
  let formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const month = formattedDate.split(" ")[0];
  formattedDate = formattedDate.replace(month, t(`months.${month}`));

  if (eventDetails?.type === "event-details") {
    dispatch(eventsActions.setCurrentEventDetails({}));
  }

  const closeDetailsHandler = () => {
    // close the event details

    if (from === "events-list") {
      dispatch(eventsActions.setCurrentEventDetails(null));
      dispatch(eventsActions.setShowEventDetails(false));
    }
    if (from === "requests") {
      dispatch(eventsActions.setCurrentEventReqDetails(null));
      dispatch(eventsActions.setShowEventReqDetails(false));
    }
  };

  return (
    <section
      className={`${styles["event-details"]} ${
        orientation ? styles.eventDetails : ""
      }`}
    >
      <CloseBtn onClick={closeDetailsHandler} />
      {type !== "event-request" && (
        <div className={styles.details}>
          <Link to={`club-page/${clubId}`}>
            <Icon
              src={Club_Page_Ic}
              alt="club page"
              title={t("events-list.event-details.club-page")}
            />
          </Link>
        </div>
      )}
      <div
        className={`${styles["event-image"]} ${
          orientation ? styles.eventImage : ""
        }`}
      >
        <Image src={EventImage} alt="Event image" />
      </div>
      <div className={styles["event-title"]}>
        <h3>{t("events-list.event-details.title")}</h3>
        <div>
          <h4>{EventName}</h4>
          {/* TODO: check if this work as expected */}
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
      <p className={styles["event-desc"]}>{description}</p>
      <div className={styles["event-desc-container"]}>
        <span>
          {t("events-list.event-details.speakers")} <span>{Speakers}</span>
        </span>
        <div className={styles["event-desc-container-in"]}>
          <div className={styles.left}>
            <div className={styles["logo-with-name"]}>
              <img
                className={styles["club-img"]}
                src={CLogo}
                alt={{ CName } + " Logo"}
              />
              <p>{CName}</p>
            </div>
            <div className={styles["logo-with-name"]}>
              <img
                className={styles["club-img"]}
                src={CMLogo}
                alt={{ CMName } + " Logo"}
              />
              <p>{CMName}</p>
            </div>
          </div>
          <div className={styles.right}>
            <div>
              {t("events-list.event-details.starting-time")}
              <span className={styles["event-span"]}> {EventSTime.label}</span>
            </div>
            <div>
              {t("events-list.event-details.ending-time")}
              <span className={styles["event-span"]}> {EventETime.label}</span>
            </div>
            <div>
              {t("events-list.event-details.date")}
              <span className={styles["event-span"]}> {formattedDate}</span>
            </div>
            <div>
              {t("events-list.event-details.location")}
              <span className={styles["event-span"]}>
                {EventLocation.label}
              </span>
            </div>
            <div>
              {t("events-list.event-details.email")}
              <span className={styles["event-span"]}> {CMEmail}</span>
            </div>
            <div>
              {t("events-list.event-details.contact")}
              <span className={styles["event-span"]}> {CMPhone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
