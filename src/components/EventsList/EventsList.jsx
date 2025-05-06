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

let initialLoad = true;

const EventsList = () => {
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

  //search events
  const searchEventParams = useSelector((state) => state.ui.searchEventParams);
  const resetEventFilter = useSelector((state) => state.ui.resetEventFilter);
  const [filterdEventsData, setFilterdEventsData] = useState([]);
  const [noSearchItemFound, setNoSearchItemFound] = useState(false);

  const filterEventsByAll = (eventsData, searchEventParams) => {
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);

      // Combine club name, category, and date filters
      const filteredEvents = listOfEvents.filter((eventItem) => {
        // Check if club name matches (if provided)
        const nameMatches =
          searchEventParams.searchedWord === "" ||
          eventItem.clubName
            .trim()
            .toLowerCase()
            .substring(0, searchEventParams.searchedWord.length) ===
            searchEventParams.searchedWord;

        // Check if categories match (if provided)
        const categoryMatches =
          searchEventParams.searchedEventCategories === null ||
          searchEventParams.searchedEventCategories.some((searchCate) =>
            eventItem.clubCategories.some(
              (category) => category.value === searchCate.value
            )
          );

        // Check if date matches (if provided)
        const dateMatches =
          searchEventParams.searchedDate === "" ||
          (new Date(eventItem.Date).getFullYear() ===
            new Date(searchEventParams.searchedDate).getFullYear() &&
            new Date(eventItem.Date).getMonth() ===
              new Date(searchEventParams.searchedDate).getMonth() &&
            new Date(eventItem.Date).getDate() ===
              new Date(searchEventParams.searchedDate).getDate());

        // Return events that match all criteria
        return nameMatches && categoryMatches && dateMatches;
      });

      // Return filtered events or noItem flag
      return filteredEvents.length > 0
        ? { ...filteredEvents }
        : { noItem: true };
    });
  };

  const filterEventsByDate = (eventsData, searchEventParams) => {
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);

      // date filter
      const filteredEvents = listOfEvents.filter((eventItem) => {
        // Check if date matches (if provided)
        const dateMatches =
          searchEventParams.searchedDate === "" ||
          (new Date(eventItem.Date).getFullYear() ===
            new Date(searchEventParams.searchedDate).getFullYear() &&
            new Date(eventItem.Date).getMonth() ===
              new Date(searchEventParams.searchedDate).getMonth() &&
            new Date(eventItem.Date).getDate() ===
              new Date(searchEventParams.searchedDate).getDate());

        // Return events that match
        return dateMatches;
      });

      // Return filtered events or noItem flag
      return filteredEvents.length > 0
        ? { ...filteredEvents }
        : { noItem: true };
    });
  };

  const filterEventsByNameAndCategory = (eventsData, searchEventParams) => {
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);

      // Combine club name and category filters
      const filteredEvents = listOfEvents.filter((eventItem) => {
        // Check if club name matches (if provided)
        const nameMatches =
          searchEventParams.searchedWord === "" ||
          eventItem.clubName
            .trim()
            .toLowerCase()
            .substring(0, searchEventParams.searchedWord.length) ===
            searchEventParams.searchedWord;

        // Check if categories match (if provided)
        const categoryMatches =
          searchEventParams.searchedEventCategories === null ||
          searchEventParams.searchedEventCategories.some((searchCate) =>
            eventItem.clubCategories.some(
              (category) => category.value === searchCate.value
            )
          );

        // Return events that match both criteria
        return nameMatches && categoryMatches;
      });

      // Return filtered events or noItem flag
      return filteredEvents.length > 0
        ? { ...filteredEvents }
        : { noItem: true };
    });
  };

  const filteredEventsByName = (eventsData, searchEventParams) => {
    const searchKeyWord = searchEventParams.searchedWord.trim().toLowerCase();
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);
      const filterdEventsFromClub = listOfEvents.filter((eventItem) => {
        return (
          eventItem.EventName.trim()
            .toLowerCase()
            .substring(0, searchKeyWord.length) === searchKeyWord
        );
      });
      if (filterdEventsFromClub.length > 0) {
        return { ...filterdEventsFromClub };
      } else {
        return {
          noItem: true,
        };
      }
    });
  };

  const filteredEventsByCategory = (eventsData, searchEventParams) => {
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);

      // Combine club name, category, and date filters
      const filteredEvents = listOfEvents.filter((eventItem) => {
        // Check if categories match (if provided)
        const categoryMatches = searchEventParams.searchedEventCategories.some(
          (searchCate) =>
            eventItem.clubCategories.some(
              (category) => category.value === searchCate.value
            )
        );

        // Return events that match all criteria
        return categoryMatches;
      });

      // Return filtered events or noItem flag
      return filteredEvents.length > 0
        ? { ...filteredEvents }
        : { noItem: true };
    });
  };

  const filteredEventsByNameAndDate = (eventsData, searchEventParams) => {
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);

      // Combine club name, category, and date filters
      const filteredEvents = listOfEvents.filter((eventItem) => {
        // Check if club name matches (if provided)
        const nameMatches =
          searchEventParams.searchedWord === "" ||
          eventItem.clubName
            .trim()
            .toLowerCase()
            .substring(0, searchEventParams.searchedWord.length) ===
            searchEventParams.searchedWord;

        // Check if date matches (if provided)
        const dateMatches =
          searchEventParams.searchedDate === "" ||
          (new Date(eventItem.Date).getFullYear() ===
            new Date(searchEventParams.searchedDate).getFullYear() &&
            new Date(eventItem.Date).getMonth() ===
              new Date(searchEventParams.searchedDate).getMonth() &&
            new Date(eventItem.Date).getDate() ===
              new Date(searchEventParams.searchedDate).getDate());

        // Return events that match all criteria
        return nameMatches && dateMatches;
      });

      // Return filtered events or noItem flag
      return filteredEvents.length > 0
        ? { ...filteredEvents }
        : { noItem: true };
    });
  };

  const filteredEventsByDateAndCategories = (eventsData, searchEventParams) => {
    return Object.values(eventsData).map((club) => {
      const listOfEvents = Object.values(club);

      // Combine club name, category, and date filters
      const filteredEvents = listOfEvents.filter((eventItem) => {
        // Check if categories match
        const categoryMatches =
          searchEventParams.searchedEventCategories === null ||
          searchEventParams.searchedEventCategories.some((searchCate) =>
            eventItem.clubCategories.some(
              (category) => category.value === searchCate.value
            )
          );
        // Check if date matches
        const dateMatches =
          searchEventParams.searchedDate === "" ||
          (new Date(eventItem.Date).getFullYear() ===
            new Date(searchEventParams.searchedDate).getFullYear() &&
            new Date(eventItem.Date).getMonth() ===
              new Date(searchEventParams.searchedDate).getMonth() &&
            new Date(eventItem.Date).getDate() ===
              new Date(searchEventParams.searchedDate).getDate());

        // Return events that match all criteria
        return categoryMatches && dateMatches;
      });

      // Return filtered events or noItem flag
      return filteredEvents.length > 0
        ? { ...filteredEvents }
        : { noItem: true };
    });
  };

  useEffect(() => {
    const fetchEventsList = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "/events-list");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(eventsActions.replaceEventsData(data));
        setIsFetching(false);
      });
    };

    const addNewEvent = (newEvent) => {
      set(
        ref(db, "req-events-list/" + newEvent.clubId + "/" + newEvent.EventId),
        {
          ...newEvent,
        }
      )
        .then(() => {
          toast.success(`"${newEvent.EventName}" event request has been send!`);
        })
        .catch(() => {
          toast.error("Error sending the event request please try again");
        });
    };

    const addNewPost = (newPost) => {
      set(ref(db, "req-posts-list/" + newPost.clubId + "/" + newPost.PostId), {
        ...newPost,
      })
        .then(() => {
          toast.success(`"${newPost.PostTitle}" post request has been send!`);
        })
        .catch(() => {
          toast.error("Error sending the post request please try again");
        });
    };

    const addReqStatus = (newReqStatus, to) => {
      set(
        ref(
          db,
          "req-status-list/" +
            to +
            newReqStatus.clubId +
            "/" +
            newReqStatus.reqId
        ),
        {
          ...newReqStatus,
          reqDate: new Date().toISOString(),
        }
      );
    };

    const deleteExistingEvent = () => {
      const starCountRef1 = ref(
        db,
        "clubslist/" + deletedEvent.clubId + "/events/" + deletedEvent.EventId
      );
      remove(starCountRef1);
      const starCountRef2 = ref(
        db,
        "events-list/" + deletedEvent.clubId + "/" + deletedEvent.EventId
      );
      remove(starCountRef2)
        .then(() => {
          toast.success(
            `"${deletedEvent.EventName}" evnet has been deleted successfully!`
          );
        })
        .catch(() => {
          toast.error("Error deleting the evnet please try again");
        });
    };

    if (initialLoad) {
      // fetch the events after abrovel at first load
      fetchEventsList();
      initialLoad = false;
    }

    if (initialLoad === false && newEvent !== null) {
      addNewEvent(newEvent.info);
      addReqStatus(newEvent.status, "event-request/");
      dispatch(eventsActions.addNewEvent(null));
    }
    if (initialLoad === false && newPost !== null) {
      addNewPost(newPost.info);
      addReqStatus(newPost.status, "post-request/");
      dispatch(eventsActions.addNewPost(null));
    }
    if (initialLoad === false && deletedEvent !== null) {
      deleteExistingEvent();
      dispatch(eventsActions.addDeletedEvent(null));
    }

    if (initialLoad === false && resetEventFilter && eventsData !== null) {
      // for reseting the search filter
      setFilterdEventsData([]);
      setNoSearchItemFound(false);
      dispatch(uiActions.setResetEventFilter(false));
      return;
    }

    if (
      initialLoad === false &&
      searchEventParams !== null &&
      eventsData !== null
    ) {
      // search logic
      let FilteredEvents = [];
      // if there is no parameters and the search button clicked
      if (
        !initialLoad &&
        searchEventParams.searchedWord === "" &&
        searchEventParams.searchedDate === "" &&
        searchEventParams.searchedEventCategories === null
      ) {
        toast.error(
          "Enter a club name or date or choose a category to begin your search."
        );
        dispatch(uiActions.setSearchEventParams(null));
        return;
      }

      // search based on both club name & categories.
      if (
        searchEventParams.searchedWord !== "" &&
        searchEventParams.searchedEventCategories !== null &&
        searchEventParams.searchedDate === ""
      ) {
        FilteredEvents = filterEventsByNameAndCategory(
          eventsData,
          searchEventParams
        );
      }

      // searched based on club name only.
      if (
        searchEventParams.searchedWord !== "" &&
        searchEventParams.searchedEventCategories === null &&
        searchEventParams.searchedDate === ""
      ) {
        FilteredEvents = filteredEventsByName(eventsData, searchEventParams);

        // if the searched item not found.
        if (FilteredEvents[0].noItem === true) {
          setNoSearchItemFound(true);
        }
      }

      // searched based on the categories only.
      if (
        searchEventParams.searchedEventCategories !== null &&
        searchEventParams.searchedWord === "" &&
        searchEventParams.searchedDate === ""
      ) {
        FilteredEvents = filteredEventsByCategory(
          eventsData,
          searchEventParams
        );
      }
      // searched based on the date only.
      if (
        searchEventParams.searchedEventCategories === null &&
        searchEventParams.searchedWord === "" &&
        searchEventParams.searchedDate !== ""
      ) {
        FilteredEvents = filterEventsByDate(eventsData, searchEventParams);
      }
      // searched based on the club name & date.
      if (
        searchEventParams.searchedEventCategories === null &&
        searchEventParams.searchedWord !== "" &&
        searchEventParams.searchedDate !== ""
      ) {
        FilteredEvents = filteredEventsByNameAndDate(
          eventsData,
          searchEventParams
        );
      }
      // searched based on the date & categories.
      if (
        searchEventParams.searchedEventCategories !== null &&
        searchEventParams.searchedWord === "" &&
        searchEventParams.searchedDate !== ""
      ) {
        FilteredEvents = filteredEventsByDateAndCategories(
          eventsData,
          searchEventParams
        );
      }

      // search based on both club name & date & categories.
      if (
        searchEventParams.searchedDate !== "" &&
        searchEventParams.searchedEventCategories !== null &&
        searchEventParams.searchedWord !== ""
      ) {
        FilteredEvents = filterEventsByAll(eventsData, searchEventParams);
      }

      // Check for no search item found ||| no working
      // if (FilteredEvents.some((clubEvents) => clubEvents.noItem)) {
      //   setNoSearchItemFound(true);
      // }
      setFilterdEventsData(FilteredEvents);
      // if the searched item found reset the state.
      if (FilteredEvents[0]?.noItem !== true) {
        setNoSearchItemFound(false);
      }
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
  ]);

  let eventsList = null;

  if (eventsData === null) {
    eventsList = <BarLoader events={true} />;
  }

  if (
    eventsData !== null &&
    filterdEventsData.length === 0 &&
    !noSearchItemFound
  ) {
    eventsList = Object.values(eventsData).map((club) =>
      Object.values(club).map((eventItem) => {
        return (
          <EventItem
            key={eventItem.EventId}
            id={eventItem.EventId}
            clubId={eventItem.clubId}
            CName={eventItem.clubName}
            CMName={eventItem.clubManager}
            CLogo={eventItem.clubIcon}
            clubCategories={eventItem.clubCategories}
            CMLogo={CM_Logo}
            Speakers={eventItem.Speakers}
            EventName={eventItem.EventName}
            EventImage={eventItem.EventImage}
            EventLocation={eventItem.location}
            EventDate={eventItem.Date}
            EventSTime={eventItem.Stime}
            EventETime={eventItem.Etime}
            CMEmail={eventItem.managerEmail}
            CMPhone={eventItem.ContactNumber}
            description={eventItem.description}
            type="event-detail"
            EventDetails={eventItem}
          />
        );
      })
    );
  }

  // console.log("from no filterd ", filterdEventsData);

  if (
    eventsData !== null &&
    filterdEventsData.length !== 0 &&
    !noSearchItemFound
  ) {
    // console.log("this is the club: ");
    eventsList = filterdEventsData.map((club) => {
      if (club.noItem === true) {
        return null;
      } else {
        return Object.values(club).map((eventItem) => {
          return (
            <EventItem
              key={eventItem.EventId}
              id={eventItem.EventId}
              clubId={eventItem.clubId}
              CName={eventItem.clubName}
              CMName={eventItem.clubManager}
              CLogo={eventItem.clubIcon}
              clubCategories={eventItem.clubCategories}
              CMLogo={CM_Logo}
              Speakers={eventItem.Speakers}
              EventName={eventItem.EventName}
              EventImage={eventItem.EventImage}
              EventLocation={eventItem.location}
              EventDate={eventItem.Date}
              EventSTime={eventItem.Stime}
              EventETime={eventItem.Etime}
              CMEmail={eventItem.managerEmail}
              CMPhone={eventItem.ContactNumber}
              description={eventItem.description}
              type="event-detail"
              EventDetails={eventItem}
            />
          );
        });
      }
    });
  }

  if (
    eventsData !== null &&
    noSearchItemFound &&
    filterdEventsData[0].noItem === true
  ) {
    console.log("No events found");
    eventsList = (
      <p className={styles["no-event-item"]}>
        No results found for your search.
      </p>
    );
  }

  if (
    eventsData === null &&
    isFetching === false &&
    filterdEventsData.length === 0
  ) {
    eventsList = (
      <p className={styles["no-event-item"]}>
        There is no events at the moment.
      </p>
    );
  }

  return (
    <G_Layout>
      <div className={styles.container}>
        <NavEvents />
        <main className={styles.main}>
          <section className={styles["events"]}>
            <ul
              className={`${styles["events-list"]} ${
                eventsData === null ? styles["event-list-hidden"] : ""
              }`}
            >
              {eventsList}
            </ul>
          </section>
          {!showEventDetails &&
            !isFetching &&
            eventsData !== null &&
            filterdEventsData[0]?.noItem !== true && (
              <section className={styles["event-hidden"]}>
                <p className={styles.hint}>
                  Click on “Details” to show Event details.
                </p>
              </section>
            )}

          {showEventDetails && <EventDetails orientation={true} />}
        </main>
      </div>
    </G_Layout>
  );
};

export default EventsList;
