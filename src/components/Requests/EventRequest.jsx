import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { eventsActions } from "../../store/events-slice";
import { toast } from "sonner";

import EventRequestItem from "./EventRequestItem";
import EventDetails from "../EventsList/EventDetails";
import DetailsHidden from "./DetailsHidden";
import BarLoader from "../UI/BarLoader";

import CM_Logo from "../../assets/icons/EventsList/club_manager_logo.png";

import styles from "./EventRequest.module.css";

let initialLoad = true;

const EventRequest = () => {
  const reqEventsList = useSelector((state) => state.events.reqEventsList);
  const showDetails = useSelector((state) => state.events.showEventReqDetails);
  const reqEventData = useSelector((state) => state.events.reqEventData);
  const rejectEventStatus = useSelector(
    (state) => state.events.rejectEventStatus
  );
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const db = database;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-events-list");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(eventsActions.setReqEventsList(data));
        setIsFetching(false);
      });
    };

    const addNewEventToClub = (newEventToClub) => {
      const updates1 = {};
      const updates2 = {};
      updates1[
        "clubslist/" +
          newEventToClub.clubId +
          "/events/" +
          newEventToClub.EventId
      ] = { ...newEventToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates1);
      // second add
      updates2[
        "/events-list/" + newEventToClub.clubId + "/" + newEventToClub.EventId
      ] = { ...newEventToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates2)
        .then(() => {
          toast.success(
            `"${newEventToClub.EventName}" event request has been accepted`
          );
        })
        .catch(() => {
          toast.error("Error accepting the event request please try again");
        });
    };

    const removeEventReq = (deletedEvent) => {
      const starCountRef = ref(
        db,
        "req-events-list/" + deletedEvent.clubId + "/" + deletedEvent.EventId
      );
      remove(starCountRef);
    };

    const editEventReqStatus = (editedStatus) => {
      const updates = {};
      updates[
        "req-status-list/event-request/" +
          editedStatus.clubId +
          "/" +
          editedStatus.reqId
      ] = editedStatus;
      update(ref(db), updates);
    };

    if (initialLoad) {
      // fetch the current events list requests at startup
      fetchCurrentUserClub();
      // dispatch(eventsActions.setShowEventDetails(false));
      initialLoad = false;
    }

    // handle the acception of the post request
    if (
      initialLoad === false &&
      reqEventData !== null &&
      reqEventsList !== null
    ) {
      addNewEventToClub(reqEventData.info);
      editEventReqStatus(reqEventData.status);
      removeEventReq(reqEventData.info);
      // TODO: CHECK IF THIS WORKS
      dispatch(eventsActions.setShowEventDetails(false));
      dispatch(eventsActions.setReqEventData(null));
    }

    // handle the rejection of Event request
    if (
      initialLoad === false &&
      rejectEventStatus !== null &&
      reqEventsList !== null
    ) {
      editEventReqStatus(rejectEventStatus);
      removeEventReq(rejectEventStatus);
      // TODO: CHECK IF THIS WORKS
      dispatch(eventsActions.setShowEventDetails(false));
      dispatch(eventsActions.setRejectEventStatus(null));
      toast.success("The event request has been rejected");
    }
  }, [dispatch, db, reqEventData, reqEventsList, rejectEventStatus]);

  let eventsList = null;

  if (reqEventsList === null && isFetching === true) {
    eventsList = <BarLoader requests={true} />;
  }

  if (reqEventsList !== null) {
    eventsList = Object.values(reqEventsList).map((club) => {
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
            type="event-request"
            requestEvent={reqEvent}
          />
        );
      });
    });
  }

  if (
    (reqEventsList === null || typeof reqEventsList === "string") &&
    isFetching === false
  ) {
    eventsList = (
      <p className={styles["no-req-event-item"]}>
        There is no event requests at the moment.
      </p>
    );
  }

  return (
    <section className={styles["event-req"]}>
      <ul className={styles["event-req-list"]}>{eventsList}</ul>
      {reqEventsList !== null && !showDetails && (
        <DetailsHidden DName="event" />
      )}
      {showDetails && <EventDetails from={"requests"} />}
    </section>
  );
};

export default EventRequest;
