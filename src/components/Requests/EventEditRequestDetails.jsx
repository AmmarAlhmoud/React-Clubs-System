import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { clubActions } from "../../store/club-slice";

import CloseBtn from "../UI/CloseBtn";
import Image from "../UI/Image";
import BarLoader from "../UI/BarLoader";

// import Edit_Request_Img from "../../assets/images/Requests/edit_request.png";

import styles from "./EventEditRequestDetails.module.css";
import { useTranslation } from "react-i18next";

let initialLoad = true;

const EventEditRequestDetails = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const EditedEventDetails = useSelector(
    (state) => state.club.currentEditedEventDetails
  );
  const currentEvent = useSelector((state) => state.club.currentEvent);
  const [isFetching, setIsFetching] = useState(false);
  const db = database;

  const {
    id,
    clubId,
    EventName,
    EventImage,
    description,
    EventSTime,
    EventETime,
    CMEmail,
    EventDate,
    EventLocation,
    CMPhone,
  } = EditedEventDetails;

  const [isEventDescNew, setIsEventDescNew] = useState(false);
  const [isEventImageNew, setIsEventImageNew] = useState(false);
  const [isEventNameNew, setIsEventNameNew] = useState(false);
  const [isEventSTimeNew, setIsEventSTimeNew] = useState(false);
  const [isEventETimeNew, setIsEventETimeNew] = useState(false);
  const [isCMEmailNew, setIsCMEmailNew] = useState(false);
  const [isEventLocationNew, setIsEventLocationNew] = useState(false);
  const [isCMPhoneNew, setIsCMPhoneNew] = useState(false);
  const [isEventDateNew, setIsEventDateNew] = useState(false);

  const isNewData = (oldInfo, newInfo) => {
    return oldInfo?.trim() !== newInfo?.trim();
  };

  let formattedDateNew = new Date(
    EditedEventDetails?.EventDate
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  let formattedDateOld = new Date(currentEvent?.Date).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const month = formattedDateNew.split(" ")[0];
  formattedDateNew = formattedDateNew.replace(month, t(`months.${month}`));

  const monthold = formattedDateOld.split(" ")[0];
  formattedDateOld = formattedDateOld.replace(monthold, t(`months.${monthold}`));

  const areDatesNotEqual = (dateString1, dateString2) => {
    // Create Date objects from the ISO strings
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    // Extract year, month, and day using getters
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth(); // 0-indexed
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Check if any of the components differ
    return year1 !== year2 || month1 !== month2 || day1 !== day2;
  };

  useEffect(() => {
    const fetchCurrentEvent = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "events-list/" + clubId + "/" + id);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setCurrentEvent(data));
        setIsFetching(false);
      });
    };

    setIsEventNameNew(false);
    setIsEventDescNew(false);
    setIsEventImageNew(false);
    setIsEventSTimeNew(false);
    setIsEventETimeNew(false);
    setIsCMEmailNew(false);
    setIsEventLocationNew(false);
    setIsCMPhoneNew(false);
    setIsEventDateNew(false);
    fetchCurrentEvent();
    if (initialLoad) {
      initialLoad = false;
    }

    if (initialLoad === false) {
      if (isNewData(EventName, currentEvent?.EventName)) {
        setIsEventNameNew(true);
      }
      if (isNewData(description, currentEvent?.description)) {
        setIsEventDescNew(true);
      }

      if (isNewData(EventImage, currentEvent?.EventImage)) {
        setIsEventImageNew(true);
      }

      if (isNewData(CMEmail, currentEvent?.managerEmail)) {
        setIsCMEmailNew(true);
      }

      if (isNewData(CMPhone, currentEvent?.ContactNumber)) {
        setIsCMPhoneNew(true);
      }

      if (isNewData(EventLocation.label, currentEvent?.location?.label)) {
        setIsEventLocationNew(true);
      }

      if (isNewData(EventSTime.label, currentEvent?.Stime?.label)) {
        setIsEventSTimeNew(true);
      }
      if (isNewData(EventETime.label, currentEvent?.Etime?.label)) {
        setIsEventETimeNew(true);
      }
      if (areDatesNotEqual(EventDate, currentEvent?.Date)) {
        setIsEventDateNew(true);
      }
    }
  }, [
    CMEmail,
    CMPhone,
    EventDate,
    EventETime.label,
    EventImage,
    EventLocation.label,
    EventName,
    EventSTime.label,
    clubId,
    currentEvent?.ContactNumber,
    currentEvent?.Date,
    currentEvent?.Etime?.label,
    currentEvent?.EventImage,
    currentEvent?.EventName,
    currentEvent?.Stime?.label,
    currentEvent?.description,
    currentEvent?.location?.label,
    currentEvent?.managerEmail,
    db,
    description,
    dispatch,
    id,
  ]);

  const closeDetailsHandler = () => {
    // close the event details
    dispatch(clubActions.setCurrentEditedEventDetails(null));
    dispatch(clubActions.setShowEditedEventDetails(false));
  };

  return (
    <>
      {isFetching && (
        <section className={styles["event-details-load"]}>
          <BarLoader postEdit={true} />
        </section>
      )}
      {!isFetching && (
        <section className={styles["event-details"]}>
          <CloseBtn onClick={closeDetailsHandler} />
          <section className={styles.sec1}>
            <h2 className={styles.h2}>
              {t("requests.event-edit-req.req-details.title-1")}
            </h2>
            <div className={styles["event-image"]}>
              <Image
                src={currentEvent?.EventImage}
                alt="Event Original Image"
              />
            </div>
          </section>
          <section className={styles.sec2}>
            <div>
              <h2 className={styles.h2}>
                {t("requests.event-edit-req.req-details.desc")}
              </h2>
              <h3>{currentEvent?.EventName}</h3>
              <p className={styles["event-desc"]}>
                {currentEvent?.description}
              </p>
            </div>
            <div>
              <div className={styles.contact}>
                {t("requests.event-edit-req.req-details.email")}
                <span className={styles["event-span"]}>
                  {currentEvent?.managerEmail}
                </span>
              </div>
              <div className={styles.contact}>
                {t("requests.event-edit-req.req-details.contact")}
                <span className={styles["event-span"]}>
                  {currentEvent?.ContactNumber}
                </span>
              </div>
            </div>
          </section>
          <section className={styles.sec3}>
            <div className={styles["event-desc-container"]}>
              <div>
                {t("requests.event-edit-req.req-details.location")}
                <span className={styles["event-span"]}>
                  {currentEvent?.location?.label}
                </span>
              </div>
              <div>
                {t("requests.event-edit-req.req-details.date")}{" "}
                <span className={styles["event-span"]}>{formattedDateOld}</span>
              </div>
              <div>
                {t("requests.event-edit-req.req-details.time")}
                <span className={styles["event-span"]}>
                  {currentEvent?.Stime?.label}-{currentEvent?.Etime?.label}
                </span>
              </div>
            </div>

            <div className={styles.border} />
          </section>
          <section className={styles.sec4}>
            <h2 className={styles.h2}>
              {t("requests.event-edit-req.req-details.title-2")}
            </h2>
            <div
              className={`${styles["event-image"]} ${
                isEventImageNew ? styles.newDataImg : ""
              }`}
            >
              <Image src={EventImage} alt="Event New Image" />
            </div>
          </section>
          <section className={styles.sec5}>
            <div>
              <h2 className={styles.h2}>
                {t("requests.event-edit-req.req-details.desc")}
              </h2>
              <h3 className={`${isEventNameNew ? styles.newData : ""}`}>
                {EventName}
              </h3>
              <p
                className={`${styles["event-desc"]} ${
                  isEventDescNew ? styles.newData : ""
                }`}
              >
                {description}
              </p>
            </div>
            <div>
              <div className={styles.contact}>
                {t("requests.event-edit-req.req-details.email")}
                <span
                  className={`${styles["event-span"]} ${
                    isCMEmailNew ? styles.newData : ""
                  }`}
                >
                  {CMEmail}
                </span>
              </div>
              <div className={styles.contact}>
                {t("requests.event-edit-req.req-details.contact")}
                <span
                  className={`${styles["event-span"]} ${
                    isCMPhoneNew ? styles.newData : ""
                  }`}
                >
                  {CMPhone}
                </span>
              </div>
            </div>
          </section>
          <section className={styles.sec6}>
            <div className={styles["event-desc-container"]}>
              <div>
                {t("requests.event-edit-req.req-details.location")}
                <span
                  className={`${styles["event-span"]} ${
                    isEventLocationNew ? styles.newData : ""
                  }`}
                >
                  {EventLocation?.label}
                </span>
              </div>
              <div>
                {t("requests.event-edit-req.req-details.date")}{" "}
                <span
                  className={`${styles["event-span"]} ${
                    isEventDateNew ? styles.newData : ""
                  }`}
                >
                  {formattedDateNew}
                </span>
              </div>
              <div>
                {t("requests.event-edit-req.req-details.time")}
                <span className={styles["event-span"]}>
                  <span className={`${isEventSTimeNew ? styles.newData : ""}`}>
                    {EventSTime?.label}
                  </span>
                  -
                  <span className={`${isEventETimeNew ? styles.newData : ""}`}>
                    {EventETime?.label}
                  </span>
                </span>
              </div>
            </div>
          </section>
        </section>
      )}
    </>
  );
};

export default EventEditRequestDetails;
