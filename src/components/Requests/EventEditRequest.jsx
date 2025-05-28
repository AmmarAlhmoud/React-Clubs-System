import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { clubActions } from "../../store/club-slice";
import { toast } from "sonner";

import EventRequestItem from "./EventRequestItem";
import EventEditRequestDetails from "../Requests/EventEditRequestDetails";
import DetailsHidden from "./DetailsHidden";
import BarLoader from "../UI/BarLoader";

import C_Logo from "../../assets/icons/EventsList/med_logo.png";
import CM_Logo from "../../assets/icons/EventsList/club_manager_logo.png";

import styles from "./EventEditRequest.module.css";
import { useTranslation } from "react-i18next";

let initialLoad = true;

const EventEditRequest = () => {
  const { t } = useTranslation();

  const reqEditEventsList = useSelector(
    (state) => state.club.reqEditEventsList
  );
  const showDetails = useSelector((state) => state.club.showEditedEventDetails);
  const reqEditedEventData = useSelector(
    (state) => state.club.reqEditedEventData
  );
  const rejectEditedEventStatus = useSelector(
    (state) => state.club.rejectEditedEventStatus
  );
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const db = database;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-edit-events-list");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setReqEditEventsList(data));
        setIsFetching(false);
      });
    };

    const addEditedEventToClub = (EditedEventToClub) => {
      const updates1 = {};
      const updates2 = {};
      updates1[
        "clubslist/" +
          EditedEventToClub.clubId +
          "/events/" +
          EditedEventToClub.EventId
      ] = { ...EditedEventToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates1);
      // second add
      updates2[
        "/events-list/" +
          EditedEventToClub.clubId +
          "/" +
          EditedEventToClub.EventId
      ] = { ...EditedEventToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates2)
        .then(() => {
          toast.success(
            `"${EditedEventToClub.EventName}" ${t(
              "requests.event-edit-req.accept-event-req"
            )}`
          );
        })
        .catch(() => {
          toast.error(t("requests.event-edit-req.error-accept-event-req"));
        });
    };

    const removeEditedEventReq = (deletedEditedEvent) => {
      const starCountRef = ref(
        db,
        "req-edit-events-list/" +
          deletedEditedEvent.clubId +
          "/" +
          deletedEditedEvent.EventId
      );
      remove(starCountRef);
    };

    const editEditedEventReqStatus = (editedStatus) => {
      const updates = {};
      updates[
        "req-status-list/event-edit-request/" +
          editedStatus.clubId +
          "/" +
          editedStatus.EventId
      ] = editedStatus;
      update(ref(db), updates);
    };

    if (initialLoad) {
      // fetch the current edit events list requests at startup
      fetchCurrentUserClub();
      initialLoad = false;
    }

    // handle the acception of the post request
    if (
      initialLoad === false &&
      reqEditedEventData !== null &&
      reqEditEventsList !== null
    ) {
      addEditedEventToClub(reqEditedEventData.info);
      editEditedEventReqStatus(reqEditedEventData.status);
      removeEditedEventReq(reqEditedEventData.info);
      dispatch(clubActions.setShowEditedEventDetails(false));
      dispatch(clubActions.setReqEditedEventData(null));
    }

    // handle the rejection of Event request
    if (
      initialLoad === false &&
      rejectEditedEventStatus !== null &&
      reqEditEventsList !== null
    ) {
      editEditedEventReqStatus(rejectEditedEventStatus);
      removeEditedEventReq(rejectEditedEventStatus);
      dispatch(clubActions.setShowEditedEventDetails(false));
      dispatch(clubActions.setRejectEditedEventStatus(null));
      toast.success(t("requests.event-edit-req.reject-event-req"));
    }
  }, [
    dispatch,
    db,
    reqEditedEventData,
    reqEditEventsList,
    rejectEditedEventStatus,
  ]);

  let editedEventsList = null;

  if (reqEditEventsList === null && isFetching === true) {
    editedEventsList = <BarLoader requests={true} />;
  }

  if (reqEditEventsList !== null) {
    editedEventsList = Object.values(reqEditEventsList).map((club) => {
      return Object.values(club).map((reqEvent) => {
        return (
          <EventRequestItem
            key={reqEvent.EventId}
            id={reqEvent.EventId}
            clubId={reqEvent.clubId}
            CName={reqEvent.clubName}
            CMName={reqEvent.clubManager}
            CLogo={reqEvent.clubIcon}
            clubCategories={reqEvent.clubCategories}
            CMLogo={CM_Logo}
            Speakers={reqEvent.Speakers}
            EventName={reqEvent.EventName}
            EventImage={reqEvent.EventImage}
            EventLocation={reqEvent.location}
            EventDate={reqEvent.Date}
            EventSTime={reqEvent.Stime}
            EventETime={reqEvent.Etime}
            CMEmail={reqEvent.managerEmail}
            CMPhone={reqEvent.ContactNumber}
            description={reqEvent.description}
            type="event-edit-request"
            requestEvent={reqEvent}
          />
        );
      });
    });
  }

  if (
    (reqEditEventsList === null || typeof reqEditEventsList === "string") &&
    isFetching === false
  ) {
    editedEventsList = (
      <p className={styles["no-req-edit-event-item"]}>
        {t("requests.event-edit-req.no-event")}
      </p>
    );
  }

  return (
    <section className={styles["event-req"]}>
      <ul className={styles["event-req-list"]}>{editedEventsList}</ul>
      {reqEditEventsList !== null && !showDetails && (
        <DetailsHidden DName={t("requests.event-edit-req.event")} />
      )}
      {showDetails && <EventEditRequestDetails />}
    </section>
  );
};

export default EventEditRequest;
