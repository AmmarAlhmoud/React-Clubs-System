import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { set, ref, onValue, remove } from "firebase/database";
import { toast } from "sonner";
import { eventsActions } from "../../store/events-slice";
import { uiActions } from "../../store/ui-slice";

import EventDetails from "./EventDetails";
import G_Layout from "../Layout/G-Layout";
import NavEvents from "../UI/NavEvents";
import EventItem from "./EventItem";
import BarLoader from "../UI/BarLoader";
import CM_Logo from "../../assets/icons/EventsList/club_manager_logo.png";

import styles from "./EventsList.module.css";
import { useTranslation } from "react-i18next";

let initialLoad = true;

const EventsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const db = database;

  const eventsData = useSelector((state) => state.events.eventsList);
  const showEventDetails = useSelector(
    (state) => state.events.showEventDetails
  );
  const newEvent = useSelector((state) => state.events.newEvent);
  const newPost = useSelector((state) => state.events.newPost);
  const deletedEvent = useSelector((state) => state.events.deletedEvent);

  const [isFetching, setIsFetching] = useState(false);
  const searchEventParams = useSelector((state) => state.ui.searchEventParams);
  const resetEventFilter = useSelector((state) => state.ui.resetEventFilter);
  const [filterdEventsData, setFilterdEventsData] = useState([]);
  const [noSearchItemFound, setNoSearchItemFound] = useState(false);

  // ——— Filter helpers ———
  const filterEventsByAll = (eventsData, searchEventParams) =>
    Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) => {
        const nameMatches =
          !searchEventParams.searchedWord ||
          e.clubName
            .trim()
            .toLowerCase()
            .startsWith(searchEventParams.searchedWord);
        const categoryMatches =
          !searchEventParams.searchedEventCategories ||
          searchEventParams.searchedEventCategories.some((sc) =>
            e.clubCategories.some((c) => c.value === sc.value)
          );
        const dateMatches =
          !searchEventParams.searchedDate ||
          (() => {
            const ev = new Date(e.Date);
            const sd = new Date(searchEventParams.searchedDate);
            return (
              ev.getFullYear() === sd.getFullYear() &&
              ev.getMonth() === sd.getMonth() &&
              ev.getDate() === sd.getDate()
            );
          })();
        return nameMatches && categoryMatches && dateMatches;
      });
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });

  const filterEventsByDate = (eventsData, searchEventParams) =>
    Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) => {
        if (!searchEventParams.searchedDate) return true;
        const ev = new Date(e.Date);
        const sd = new Date(searchEventParams.searchedDate);
        return (
          ev.getFullYear() === sd.getFullYear() &&
          ev.getMonth() === sd.getMonth() &&
          ev.getDate() === sd.getDate()
        );
      });
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });

  const filterEventsByNameAndCategory = (eventsData, searchEventParams) =>
    Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) => {
        const nameMatches =
          !searchEventParams.searchedWord ||
          e.clubName
            .trim()
            .toLowerCase()
            .startsWith(searchEventParams.searchedWord);
        const categoryMatches =
          !searchEventParams.searchedEventCategories ||
          searchEventParams.searchedEventCategories.some((sc) =>
            e.clubCategories.some((c) => c.value === sc.value)
          );
        return nameMatches && categoryMatches;
      });
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });

  const filteredEventsByName = (eventsData, searchEventParams) => {
    const key = searchEventParams.searchedWord.trim().toLowerCase();
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) =>
        e.EventName.trim().toLowerCase().startsWith(key)
      );
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });
  };

  const filteredEventsByCategory = (eventsData, searchEventParams) =>
    Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) =>
        searchEventParams.searchedEventCategories.some((sc) =>
          e.clubCategories.some((c) => c.value === sc.value)
        )
      );
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });

  const filteredEventsByNameAndDate = (eventsData, searchEventParams) =>
    Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) => {
        const nameMatches =
          !searchEventParams.searchedWord ||
          e.clubName
            .trim()
            .toLowerCase()
            .startsWith(searchEventParams.searchedWord);
        const ev = new Date(e.Date);
        const sd = new Date(searchEventParams.searchedDate);
        const dateMatches =
          !searchEventParams.searchedDate ||
          (ev.getFullYear() === sd.getFullYear() &&
            ev.getMonth() === sd.getMonth() &&
            ev.getDate() === sd.getDate());
        return nameMatches && dateMatches;
      });
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });

  const filteredEventsByDateAndCategories = (eventsData, searchEventParams) =>
    Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filtered = listOfEvents.filter((e) => {
        const categoryMatches =
          !searchEventParams.searchedEventCategories ||
          searchEventParams.searchedEventCategories.some((sc) =>
            e.clubCategories.some((c) => c.value === sc.value)
          );
        const ev = new Date(e.Date);
        const sd = new Date(searchEventParams.searchedDate);
        const dateMatches =
          !searchEventParams.searchedDate ||
          (ev.getFullYear() === sd.getFullYear() &&
            ev.getMonth() === sd.getMonth() &&
            ev.getDate() === sd.getDate());
        return categoryMatches && dateMatches;
      });
      return filtered.length > 0 ? { ...filtered } : { noItem: true };
    });

  useEffect(() => {
    // fetch
    const fetchEventsList = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "/events-list");
      onValue(starCountRef, (snapshot) => {
        dispatch(eventsActions.replaceEventsData(snapshot.val()));
        setIsFetching(false);
      });
    };

    // add new event
    const addNewEvent = (info) =>
      set(ref(db, `req-events-list/${info.clubId}/${info.EventId}`), info)
        .then(() =>
          toast.success(
            `"${info.EventName}" ${t("events-list.send-event-req")}`
          )
        )
        .catch(() => toast.error(t("events-list.send-error-event-req")));

    // add new post
    const addNewPost = (info) =>
      set(ref(db, `req-posts-list/${info.clubId}/${info.PostId}`), info)
        .then(() =>
          toast.success(`"${info.PostTitle}" ${t("events-list.send-post-req")}`)
        )
        .catch(() => toast.error(t("events-list.send-error-post-req")));

    // add request status
    const addReqStatus = (status, to) =>
      set(ref(db, `req-status-list/${to}${status.clubId}/${status.reqId}`), {
        ...status,
        reqDate: new Date().toISOString(),
      });

    // delete existing event
    const deleteExistingEvent = () => {
      const clubRef = ref(
        db,
        `clubslist/${deletedEvent.clubId}/events/${deletedEvent.EventId}`
      );
      const listRef = ref(
        db,
        `events-list/${deletedEvent.clubId}/${deletedEvent.EventId}`
      );
      remove(clubRef);
      remove(listRef)
        .then(() =>
          toast.success(
            `"${deletedEvent.EventName}" ${t("events-list.delete-event-req")}`
          )
        )
        .catch(() => toast.error(t("events-list.delete-error-event-req")));
    };

    if (initialLoad) {
      fetchEventsList();
      initialLoad = false;
    }

    if (!initialLoad && newEvent) {
      addNewEvent(newEvent.info);
      addReqStatus(newEvent.status, "event-request/");
      dispatch(eventsActions.addNewEvent(null));
    }

    if (!initialLoad && newPost) {
      addNewPost(newPost.info);
      addReqStatus(newPost.status, "post-request/");
      dispatch(eventsActions.addNewPost(null));
    }

    if (!initialLoad && deletedEvent) {
      deleteExistingEvent();
      dispatch(eventsActions.addDeletedEvent(null));
    }

    if (!initialLoad && resetEventFilter && eventsData) {
      setFilterdEventsData([]);
      setNoSearchItemFound(false);
      dispatch(uiActions.setResetEventFilter(false));
      return;
    }

    if (!initialLoad && searchEventParams && eventsData) {
      const { searchedWord, searchedDate, searchedEventCategories } =
        searchEventParams;

      if (!searchedWord && !searchedDate && !searchedEventCategories) {
        toast.error(t("events-list.enter-clubname-date-cate"));
        dispatch(uiActions.setSearchEventParams(null));
        return;
      }

      let FilteredEvents = [];

      if (searchedWord && !searchedDate && !searchedEventCategories) {
        FilteredEvents = filteredEventsByName(eventsData, searchEventParams);
      } else if (!searchedWord && !searchedDate && searchedEventCategories) {
        FilteredEvents = filteredEventsByCategory(
          eventsData,
          searchEventParams
        );
      } else if (!searchedWord && searchedDate && !searchedEventCategories) {
        FilteredEvents = filterEventsByDate(eventsData, searchEventParams);
      } else if (searchedWord && searchedDate && !searchedEventCategories) {
        FilteredEvents = filteredEventsByNameAndDate(
          eventsData,
          searchEventParams
        );
      } else if (!searchedWord && searchedDate && searchedEventCategories) {
        FilteredEvents = filteredEventsByDateAndCategories(
          eventsData,
          searchEventParams
        );
      } else if (searchedWord && !searchedDate && searchedEventCategories) {
        FilteredEvents = filterEventsByNameAndCategory(
          eventsData,
          searchEventParams
        );
      } else if (searchedWord && searchedDate && searchedEventCategories) {
        FilteredEvents = filterEventsByAll(eventsData, searchEventParams);
      }

      setFilterdEventsData(FilteredEvents);
      const allClubsEmpty =
        Array.isArray(FilteredEvents) &&
        FilteredEvents.length > 0 &&
        FilteredEvents.every((club) => club.noItem === true);
      setNoSearchItemFound(allClubsEmpty);

      dispatch(uiActions.setSearchEventParams(null));
    }
  }, [
    dispatch,
    db,
    newEvent,
    newPost,
    deletedEvent,
    searchEventParams,
    resetEventFilter,
    eventsData,
    t,
  ]);

  // ——— Render logic ———
  let eventsList = null;

  if (!eventsData) {
    eventsList = <BarLoader events />;
  }

  if (eventsData && filterdEventsData.length === 0 && !noSearchItemFound) {
    eventsList = Object.values(eventsData)
      .flatMap((club) => Object.values(club))
      .map((e) => (
        <EventItem
          key={e.EventId}
          id={e.EventId}
          clubId={e.clubId}
          CName={e.clubName}
          CMName={e.clubManager}
          CLogo={e.clubIcon}
          clubCategories={e.clubCategories}
          CMLogo={CM_Logo}
          Speakers={e.Speakers}
          EventName={e.EventName}
          EventImage={e.EventImage}
          EventLocation={e.location}
          EventDate={e.Date}
          EventSTime={e.Stime}
          EventETime={e.Etime}
          CMEmail={e.managerEmail}
          CMPhone={e.ContactNumber}
          description={e.description}
          type="event-detail"
          EventDetails={e}
        />
      ));
  }

  if (eventsData && filterdEventsData.length > 0 && !noSearchItemFound) {
    eventsList = filterdEventsData.flatMap((club) =>
      club.noItem
        ? []
        : Object.values(club).map((e) => (
            <EventItem
              key={e.EventId}
              id={e.EventId}
              clubId={e.clubId}
              CName={e.clubName}
              CMName={e.clubManager}
              CLogo={e.clubIcon}
              clubCategories={e.clubCategories}
              CMLogo={CM_Logo}
              Speakers={e.Speakers}
              EventName={e.EventName}
              EventImage={e.EventImage}
              EventLocation={e.location}
              EventDate={e.Date}
              EventSTime={e.Stime}
              EventETime={e.Etime}
              CMEmail={e.managerEmail}
              CMPhone={e.ContactNumber}
              description={e.description}
              type="event-detail"
              EventDetails={e}
            />
          ))
    );
  }

  if (eventsData && noSearchItemFound) {
    eventsList = (
      <p className={styles["no-event-item"]}>{t("events-list.no-results")}</p>
    );
  }

  if (!eventsData && !isFetching && filterdEventsData.length === 0) {
    eventsList = (
      <p className={styles["no-event-item"]}>{t("events-list.no-events")}</p>
    );
  }

  return (
    <G_Layout>
      <div className={styles.container}>
        <NavEvents />
        <main className={styles.main}>
          <section className={styles.events}>
            <ul
              className={`${styles["events-list"]} ${
                !eventsData ? styles["event-list-hidden"] : ""
              }`}
            >
              {eventsList}
            </ul>
          </section>
          {!showEventDetails &&
            !isFetching &&
            eventsData &&
            !filterdEventsData[0]?.noItem && (
              <section className={styles["event-hidden"]}>
                <p className={styles.hint}>{t("events-list.show-details")}</p>
              </section>
            )}
          {showEventDetails && (
            <EventDetails from="events-list" orientation={true} />
          )}
        </main>
      </div>
    </G_Layout>
  );
};

export default EventsList;
