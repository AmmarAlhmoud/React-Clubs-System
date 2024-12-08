import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { clubActions } from "../../store/club-slice";
import { eventsActions } from "../../store/events-slice";

import ColoredButton from "../UI/ColoredButton";

import styles from "./EventRequestItem.module.css";

let initialLoad = true;

const EventRequestItem = ({
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
  requestEvent,
}) => {
  const parsedDate = new Date(EventDate);
  const formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showDetails = useSelector((state) => state.events.showEventDetails);
  const showEditedEventDetails = useSelector(
    (state) => state.club.showEditedEventDetails
  );

  const updatedClubInfo = useSelector((state) => state.club.updatedClubInfo);
  const reqClubStatus = useSelector((state) => state.club.reqClubStatus);
  const reqEventStatus = useSelector((state) => state.events.reqEventStatus);
  const reqEditEventStatus = useSelector(
    (state) => state.club.reqEditEventStatus
  );
  const [isFetching, setIsFetching] = useState(false);
  const db = database;

  useEffect(() => {
    const fetchCurrentUserClub = (from) => {
      setIsFetching(true);
      const starCountRef = ref(db, `${from}` + clubId + "/" + clubId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (from === "/req-edit-club-list/") {
          dispatch(clubActions.setUpdatedClubInfo(data));
        }
        if (from === "/req-status-list/edit-club-req/") {
          dispatch(clubActions.setReqClubStatus(data));
        }
      });
      setIsFetching(false);
    };

    const fetchCurrentEventStatus = () => {
      const starCountRef = ref(
        db,
        "req-status-list/event-request/" + clubId + "/" + id
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(eventsActions.setReqEventStatus(data));
      });
    };

    const fetchCurrentEditEventStatus = () => {
      const starCountRef = ref(
        db,
        "req-status-list/event-edit-request/" + clubId + "/" + id
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        dispatch(clubActions.setReqEditEventStatus(data));
      });
    };

    if (
      (initialLoad || id !== null) &&
      (type === "event-request" || type === "event-edit-request")
    ) {
      fetchCurrentEventStatus();
      fetchCurrentEditEventStatus();
      initialLoad = false;
    }

    if (type === "club-edit-request") {
      fetchCurrentUserClub("/req-edit-club-list/");
      fetchCurrentUserClub("/req-status-list/edit-club-req/");
    }
  }, [dispatch, db, type, clubId, id]);

  const showEventDetailsHandler = () => {
    dispatch(
      eventsActions.setCurrentEventDetails({
        id,
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
        type: "event-request",
      })
    );
    dispatch(eventsActions.setShowEventDetails({ show: true, id }));
  };

  const showClubDetailsHandler = () => {
    navigate(`club-edit-details/${clubId}`);
  };

  const acceptClubEditHandler = () => {
    if (updatedClubInfo !== null && reqClubStatus !== null) {
      dispatch(
        clubActions.setUpdatedClubInfo({
          info: updatedClubInfo,
          status: { ...reqClubStatus, status: "accepted" },
        })
      );
    }
  };

  const rejectClubEditHandler = () => {
    dispatch(
      clubActions.rejectClubEditingReq({ ...reqClubStatus, status: "rejected" })
    );
  };

  const acceptEventReqHandler = () => {
    if (
      requestEvent !== null &&
      reqEventStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        eventsActions.setReqEventData({
          info: requestEvent,
          status: {
            ...reqEventStatus,
            status: "accepted",
          },
        })
      );
    }
  };

  const rejectEventReqHandler = () => {
    if (
      requestEvent !== null &&
      reqEventStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        eventsActions.setRejectEventStatus({
          ...reqEventStatus,
          status: "rejected",
        })
      );
    }
  };

  const acceptEditEventHandler = () => {
    if (
      requestEvent !== null &&
      reqEditEventStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        clubActions.setReqEditedEventData({
          info: requestEvent,
          status: {
            ...reqEditEventStatus,
            status: "accepted",
          },
        })
      );
    }
  };

  const rejectEditEditHandler = () => {
    if (
      requestEvent !== null &&
      reqEditEventStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        clubActions.setRejectEditedEventStatus({
          ...reqEditEventStatus,
          status: "rejected",
        })
      );
    }
  };

  const showEditEventDetailsHandler = () => {
    dispatch(
      clubActions.setCurrentEditedEventDetails({
        id,
        clubId,
        EventName,
        EventDate,
        EventImage,
        description,
        EventSTime,
        EventETime,
        CMEmail,
        EventLocation,
        CMPhone,
      })
    );
    dispatch(clubActions.setShowEditedEventDetails({ show: true, id }));
  };

  return (
    <li
      id={id}
      className={`${styles.container} ${
        type === "club-edit-request" ? styles["no-detials"] : ""
      }`}
    >
      <section className={styles["club-info"]}>
        <div className={styles["logo-name-conatiner"]}>
          <img src={CLogo} alt={CName + " Logo"} />
          <p>{CName}</p>
        </div>
        <div className={styles["logo-name-conatiner"]}>
          <img src={CMLogo} alt={CMName + " Logo"} />
          <p>{CMName}</p>
        </div>
      </section>
      {type !== "club-edit-request" && (
        <ul className={styles["event-info"]}>
          <li className={styles.sec1}>
            <span>
              <p className={styles["event-tag"]}>Event</p>
              <p className={styles["event-tag-content"]}>{EventName}</p>
            </span>
            <span>
              <p className={styles["event-tag"]}>Location</p>
              <p className={styles["event-tag-content"]}>
                {EventLocation?.label}
              </p>
            </span>
            <span>
              <p className={styles["event-tag"]}>Date & Time</p>
              <p
                className={styles["event-tag-content"]}
              >{`${formattedDate}, ${EventSTime?.label}-${EventETime?.label}`}</p>
            </span>
          </li>
          <li className={styles.sec2}>
            <span>
              <p className={styles["event-tag"]}>Email</p>
              <p className={styles["event-tag-content"]}>{CMEmail}</p>
            </span>
            <span>
              <p className={styles["event-tag"]}>Content Number</p>
              <p className={styles["event-tag-content"]}>{CMPhone}</p>
            </span>
          </li>
        </ul>
      )}
      <div className={styles.actions}>
        {type === "event-request" && (
          <ColoredButton onClick={acceptEventReqHandler}>Accept</ColoredButton>
        )}
        {type === "event-request" && (
          <ColoredButton red={true} onClick={rejectEventReqHandler}>
            Reject
          </ColoredButton>
        )}
        {type === "club-edit-request" && (
          <ColoredButton onClick={acceptClubEditHandler} disabled={isFetching}>
            Accept
          </ColoredButton>
        )}
        {type === "club-edit-request" && (
          <ColoredButton
            red={true}
            onClick={rejectClubEditHandler}
            disabled={isFetching}
          >
            Reject
          </ColoredButton>
        )}
        {type === "event-edit-request" && (
          <ColoredButton onClick={acceptEditEventHandler} disabled={isFetching}>
            Accept
          </ColoredButton>
        )}
        {type === "event-edit-request" && (
          <ColoredButton
            red={true}
            onClick={rejectEditEditHandler}
            disabled={isFetching}
          >
            Reject
          </ColoredButton>
        )}
      </div>
      {/* TODO: handler the details button state */}
      <div
        className={`${styles["action-details"]} ${
          showDetails.show && id === showDetails.id && type === "event-request"
            ? styles.active
            : ""
        }`}
      >
        {type === "event-request" && (
          <ColoredButton purble={true} onClick={showEventDetailsHandler}>
            Details
          </ColoredButton>
        )}
        {type === "club-edit-request" && (
          <ColoredButton purble={true} onClick={showClubDetailsHandler}>
            Details
          </ColoredButton>
        )}
      </div>
      {type === "event-edit-request" && (
        <div
          className={`${styles["action-details"]} ${
            showEditedEventDetails.show &&
            id === showEditedEventDetails.id &&
            type === "event-edit-request"
              ? styles.active
              : ""
          }`}
        >
          <ColoredButton purble={true} onClick={showEditEventDetailsHandler}>
            Details
          </ColoredButton>
        </div>
      )}
    </li>
  );
};

export default EventRequestItem;
