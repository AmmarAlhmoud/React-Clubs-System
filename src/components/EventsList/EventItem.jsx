import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthUserType } from "../../util/auth.js";
import { eventsActions } from "../../store/events-slice";

import ColoreButton from "../UI/ColoredButton";
import CateList from "./CateList";
import CateItem from "./CateItem";
import delIcon from "../../assets/icons/ClubsList/delete.png";
import EventDelModal from "./EventDelModal.jsx";

import styles from "./EventItem.module.css";

const EventItem = ({
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
  EventDetails,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const userType = getAuthUserType();

  const formattedDate = new Date(EventDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const showDetails = useSelector((state) => state.events.showEventDetails);

  const showDetailsHandler = () => {
    dispatch(
      eventsActions.setCurrentEventDetails({
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
        EventDetails,
      })
    );
    dispatch(eventsActions.setShowEventDetails({ show: true, id }));
  };

  return (
    <>
      <li id={id} className={styles.container}>
        <section className={styles["club-info"]}>
          <div className={styles["club-name-container"]}>
            <img src={CLogo} alt={CName + " Logo"} />
            <div className={styles["name-cate-container"]}>
              <p>{CName}</p>
              <CateList>
                {clubCategories &&
                  clubCategories?.map((cateName) => (
                    <CateItem
                      key={cateName?.label}
                      cateName={cateName?.label}
                      className={styles["cate-item"]}
                    />
                  ))}
              </CateList>
            </div>
          </div>
          {userType === "Ad" && (
            <div className={styles.icons}>
              <button onClick={() => setIsModalOpen(true)}>
                <img src={delIcon} alt="delete" />
              </button>
            </div>
          )}
        </section>
        <ul className={styles["event-info"]}>
          <li>
            <p className={styles["event-tag"]}>Event</p>
            <p className={styles["event-tag-content"]}>{EventName}</p>
          </li>
          <li>
            <p className={styles["event-tag"]}>Location</p>
            <p className={styles["event-tag-content"]}>{EventLocation?.label}</p>
          </li>
          <li>
            <p className={styles["event-tag"]}>Date & Time</p>
            <div className={styles.last}>
              <p
                className={`${styles["event-tag-content"]} ${styles.eventDateTime}`}
              >
                {formattedDate}
                <span>
                  {EventSTime?.label} - {EventETime?.label}
                </span>
              </p>
            </div>
          </li>
        </ul>
        <ColoreButton
          className={
            showDetails.show && showDetails.id === id ? styles.active : ""
          }
          onClick={showDetailsHandler}
        >
          Details
        </ColoreButton>
      </li>
      {isModalOpen && (
        <EventDelModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          icon={CLogo}
          EventId={id}
          title={EventName}
          clubId={clubId}
          EventName={EventName}
        />
      )}
    </>
  );
};

export default EventItem;
