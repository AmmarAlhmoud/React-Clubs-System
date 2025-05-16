import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { clubActions } from "../../store/club-slice";
import { getAuthUserId } from "../../util/auth";

import members from "../../assets/icons/CM-Dashboard/members.png";
import next_event from "../../assets/icons/CM-Dashboard/next_event.png";
import total_events from "../../assets/icons/CM-Dashboard/total_events.png";
import responded from "../../assets/icons/CM-Dashboard/responded.png";
import pending from "../../assets/icons/CM-Dashboard/pending.png";
import accepted from "../../assets/icons/CM-Dashboard/accepted.png";
import rejected from "../../assets/icons/CM-Dashboard/rejected.png";
import del from "../../assets/icons/CM-Dashboard/delete.png";
import cancel from "../../assets/icons/CM-Dashboard/cancel.png";
import question from "../../assets/icons/CM-Dashboard/question.png";

import RecentEventItem from "./RecentEventItem";
import WeeklyCalender from "../Dashboard/WeeklyCalender";
import DelModal from "../MyClub/DelModal";

import styles from "./CmDashboard.module.css";

// Recieved dynamic club information (including the club's events + posts)
// import CLUB_INFO from "../MyClub/dummyClubInfo";
// const events = CLUB_INFO.events;
// Recieved dynamic dummy events
// import DUMMY_EVENTS from "../Dashboard/dummyEvents";
import { uiActions } from "../../store/ui-slice";
import RecentEventsCarousel from "./RecentEventsCarousel";

let initialLoad = true;

const CmDashboard = () => {
  // For Event or Post Deletion Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // For Request Deletion Modal
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const db = database;
  const userId = getAuthUserId();

  const cMEventsList = useSelector((state) => state.ui.cMEventsList);

  const currentClubMGDashData = useSelector(
    (state) => state.ui.currentClubMGDashData
  );

  const currentEventReqStatusCM = useSelector(
    (state) => state.ui.currentEventReqStatusCM
  );
  const currentPostReqStatusCM = useSelector(
    (state) => state.ui.currentPostReqStatusCM
  );
  const currentPostEditReqStatusCM = useSelector(
    (state) => state.ui.currentPostEditReqStatusCM
  );
  const currentEventEditReqStatusCM = useSelector(
    (state) => state.ui.currentEventEditReqStatusCM
  );

  const currentClubEditReqStatusCM = useSelector(
    (state) => state.ui.currentClubEditReqStatusCM
  );

  const clubsListForCM = useSelector((state) => state.ui.clubsListForCM);
  const recentEventsData = useSelector((state) => state.ui.recentEventsData);

  // const allReqList = useSelector((state) => state.ui.allReqList);

  const [allReqList, setAllReqList] = useState([]); // Use an empty array initially

  const handleAddItem = (newItem) => {
    const existingIds = new Set(
      allReqList.map((item) => item.PostId || item.EventId)
    ); // Create a Set of existing PostId or EventId

    const isUnique = !existingIds.has(newItem.PostId || newItem.EventId); // Check for uniqueness based on either property

    if (isUnique) {
      setAllReqList((prevList) => [...prevList, newItem]); // Add new item if unique
    }
  };

  // For responded request status icon (accepted or rejected)
  let ResponseStatus = true;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      dispatch(uiActions.setIsCmDashLoading(true));
      const starCountRef = ref(db, "clubslist/" + userId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.setCurrentClubMGDashData(data));
        setIsFetching(false);
        dispatch(uiActions.setIsCmDashLoading(false));
      });
    };
    const fetchCurrentAllClub = () => {
      const starCountRef1 = ref(db, "clubslist");
      onValue(starCountRef1, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.replaceClubsListForCM(data));
      });
    };
    const fetchCurrentReqStatusClub = (from) => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-status-list/" + from + userId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (from === "event-request/") {
          dispatch(uiActions.setCurrentEventReqStatusCM(data));
        }
        if (from === "post-request/") {
          dispatch(uiActions.setCurrentPostReqStatusCM(data));
        }
        if (from === "post-edit-request/") {
          dispatch(uiActions.setCurrentPostEditReqStatusCM(data));
        }
        if (from === "event-edit-request/") {
          dispatch(uiActions.setCurrentEventEditReqStatusCM(data));
        }
        if (from === "edit-club-req/") {
          dispatch(uiActions.setCurrentClubEditReqStatusCM(data));
        }
        setIsFetching(false);
      });
    };

    // fetch the current user club at startup
    if (initialLoad) {
      fetchCurrentUserClub();
      fetchCurrentAllClub();
      fetchCurrentReqStatusClub("event-request/");
      fetchCurrentReqStatusClub("post-request/");
      fetchCurrentReqStatusClub("post-edit-request/");
      fetchCurrentReqStatusClub("event-edit-request/");
      fetchCurrentReqStatusClub("edit-club-req/");
      // dispatch(uiActions.setAllReqList())
      initialLoad = false;
    }

    if (initialLoad === false && currentClubMGDashData !== null) {
      const fetchedEventsList = currentClubMGDashData?.events;
      if (fetchedEventsList !== undefined) {
        dispatch(uiActions.setCMEventsList(Object.values(fetchedEventsList)));
      }
    }

    if (initialLoad === false && clubsListForCM !== null) {
      Object.values(clubsListForCM).map((club) => {
        const fetchedEventsList = club?.events;
        if (fetchedEventsList !== undefined) {
          dispatch(
            uiActions.setRecentEventsData(Object.values(fetchedEventsList))
          );
        }
      });
    }

    // if (initialLoad === false && currentEventReqStatusCM !== null) {
    //   const eventReq = Object.values(currentEventReqStatusCM);
    //   dispatch(uiActions.setAllReqList(eventReq));
    // }

    // if (initialLoad === false && currentPostReqStatusCM !== null) {
    //   const postReq = Object.values(currentPostReqStatusCM);
    //   dispatch(uiActions.setAllReqList(postReq));
    // }

    // if (initialLoad === false && currentPostEditReqStatusCM !== null) {
    //   const postEditReq = Object.values(currentPostEditReqStatusCM);
    //   dispatch(uiActions.setAllReqList(...postEditReq));
    // }

    // if (initialLoad === false && currentEventEditReqStatusCM !== null) {
    //   const eventEditReq = Object.values(currentEventEditReqStatusCM);
    //   dispatch(uiActions.setAllReqList(...eventEditReq));
    // }

    // if (initialLoad === false && currentClubEditReqStatusCM !== null) {
    //   const clubEditReq = Object.values(currentClubEditReqStatusCM);

    //   dispatch(uiActions.setAllReqList(...clubEditReq));
    // }
  }, [
    dispatch,
    db,
    userId,
    currentClubMGDashData,
    currentEventReqStatusCM,
    currentPostReqStatusCM,
    currentPostEditReqStatusCM,
    currentEventEditReqStatusCM,
    currentClubEditReqStatusCM,
    clubsListForCM,
  ]);

  let totalEvents = 0;

  if (cMEventsList !== null) {
    totalEvents = cMEventsList.length;
  }

  let pendingList = [];
  let pendingRequestsList = [];
  let acceptingList = [];
  let acceptingRequestsList = [];

  // console.log("all req: ", allReqList);

  let reqList = [];

  if (currentEventReqStatusCM !== null) {
    const eventReq = Object.values(currentEventReqStatusCM);
    reqList.push(...eventReq);
  }

  if (currentPostReqStatusCM !== null) {
    const postReq = Object.values(currentPostReqStatusCM);
    reqList.push(...postReq);
  }

  if (currentPostEditReqStatusCM !== null) {
    const postEditReq = Object.values(currentPostEditReqStatusCM);
    reqList.push(...postEditReq);
  }

  if (currentEventEditReqStatusCM !== null) {
    const eventEditReq = Object.values(currentEventEditReqStatusCM);
    reqList.push(...eventEditReq);
  }

  if (currentClubEditReqStatusCM !== null) {
    const clubEditReq = Object.values(currentClubEditReqStatusCM);
    reqList.push(...clubEditReq);
  }

  if (reqList.length > 0) {
    {
      let reqType;
      pendingList = reqList.map((event, index) => {
        const formattedDate = new Date(event?.reqDate).toLocaleDateString(
          "en-US",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        let type = event.reqType;
        if (event.status === "pending") {
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

          pendingRequestsList.push(1);
          return (
            <div key={index} className={styles.dataItem}>
              <div>
                <span>{formattedDate}</span> <span>{reqType}</span>
                {/* <h3>{event.location.label}</h3> */}
              </div>
              <div className={styles.icons}>
                {/* <img
                  src={cancel}
                  alt="cancel"
                  onClick={() => setIsReqModalOpen(true)}
                /> */}
              </div>
            </div>
          );
        }
      });
    }

    {
      let reqType;
      acceptingList = reqList.map((event, index) => {
        const formattedDate = new Date(event?.reqDate).toLocaleDateString(
          "en-US",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        let type = event.reqType;

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
        if (event.status === "accepted") {
          ResponseStatus = true;
          acceptingRequestsList.push(1);
          return (
            <div key={index} className={styles.dataItem}>
              <div>
                <span>{formattedDate}</span> <span>{reqType}</span>
                <h3>{event.location?.label}</h3>
              </div>
              <div className={styles.icons}>
                {/* Check response status and render appropriate icon */}
                {ResponseStatus ? (
                  <img src={accepted} alt="accepted" />
                ) : (
                  <img src={rejected} alt="rejected" />
                )}
                {/* <img
                  src={del}
                  alt="delete"
                  className={styles.delcon}
                  onClick={() => setIsModalOpen(true)}
                /> */}
              </div>
            </div>
          );
        }
        if (event.status === "rejected") {
          ResponseStatus = false;

          acceptingRequestsList.push(1);
          return (
            <div key={index} className={styles.dataItem}>
              <div>
                <span>{formattedDate}</span> <span>{reqType}</span>
                <h3>{event.location?.label}</h3>
              </div>
              <div className={styles.icons}>
                {/* Check response status and render appropriate icon */}
                {ResponseStatus ? (
                  <img src={accepted} alt="accepted" />
                ) : (
                  <img src={rejected} alt="rejected" />
                )}
                {/* <img
                  src={del}
                  alt="delete"
                  className={styles.delcon}
                  onClick={() => setIsModalOpen(true)}
                /> */}
              </div>
            </div>
          );
        }
      });
    }
  }

  const isCloserDate = (currentDate, isoStringDate) => {
    // Extract year, month, and day from ISO string
    const comparedYear = parseInt(isoStringDate.slice(0, 4), 10);
    const comparedMonth = parseInt(isoStringDate.slice(5, 7), 10) - 1; // Adjust for zero-based months
    const comparedDay = parseInt(isoStringDate.slice(8, 10), 10);

    const currentDateInDays =
      currentDate.getFullYear() * 365 +
      currentDate.getMonth() * 30 +
      currentDate.getDate();
    const comparedDateInDays =
      comparedYear * 365 + comparedMonth * 30 + comparedDay;

    // Calculate absolute difference in days (ignoring time)
    const diff = Math.abs(currentDateInDays - comparedDateInDays);

    // Assume any date is closer than itself (for edge cases)
    return diff > 0;
  };

  let myNextEvent = null;

  if (recentEventsData !== null) {
    // Find the index of the closest event using reduce and Math.min
    const closestEventIndex = recentEventsData.reduce(
      (closestIndex, eventItem, index) => {
        const isCurrentCloser = isCloserDate(new Date(), eventItem.Date);
        if (closestIndex === null || isCurrentCloser) {
          return index;
        } else {
          return closestIndex;
        }
      },
      null
    );

    // If a closest event was found, extract it from the array
    if (closestEventIndex !== null) {
      myNextEvent = recentEventsData[closestEventIndex];
    }
  }

  let formattedDate;

  if (myNextEvent !== null) {
    formattedDate = new Date(myNextEvent?.Date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // const recentEvents = recentEventsData.map((event, index) => (
  //   <RecentEventItem
  //     key={index}
  //     clubName={event.clubName}
  //     clubIcon={event.clubIcon}
  //     event={event}
  //   />
  // ));

  // console.log(recentEventsData, ": from CM Dashboard");

  return (
    <main className={styles.container}>
      {/* Recent Events Section */}
      <section className={styles.recent}>
        <h1>Recent New Events</h1>
        <div className={styles.renderedEvents}>
          {recentEventsData !== null && (
            <RecentEventsCarousel items={recentEventsData} />
          )}
        </div>
      </section>
      {/* Upper Right Stats Section */}
      <section className={styles.statsTop}>
        <div>
          <img src={next_event} alt="" />
          <div className={styles.inner}>
            <h1>My Next Event</h1>
            <h2>{myNextEvent !== null && formattedDate}</h2>
            <h3>
              {myNextEvent !== null && myNextEvent?.Stime?.label} -{" "}
              {myNextEvent !== null && myNextEvent?.Etime?.label}
            </h3>
          </div>
        </div>
        <div>
          <img src={total_events} alt="" />
          <div className={styles.inner}>
            <h1>Total Events</h1>
            <h2>
              <span>{totalEvents}</span> Event
            </h2>
          </div>
        </div>
      </section>
      {/* Weekly Calender Section */}
      <section className={styles.calender}>
        <WeeklyCalender />
      </section>
      {/* Lower Right Stats Section */}
      <section className={styles.statsBottom}>
        {/* Responded events section*/}
        <div className={styles.responded}>
          <div>
            <img src={responded} alt="responded" />
            <h1>
              <span>{acceptingRequestsList?.length || 0}</span> Responded
            </h1>
          </div>
          <div className={styles.respondedData}>
            {/* Rendering Responded Events*/}
            <h2>Request Results</h2>
            <div className={styles.renderedResponses}>{acceptingList}</div>
          </div>
          <div className={styles.filler}></div>
        </div>
        {/* Requested events section*/}
        <div className={styles.pending}>
          <div>
            <img src={pending} alt="pending" />
            <h1>
              <span>{pendingRequestsList?.length || 0}</span> Pending
            </h1>
          </div>
          <div className={styles.pendingData}>
            {/* Rendering Requested Events*/}
            <h2>Pending Requests</h2>
            <div className={styles.renderedResponses}>{pendingList}</div>
          </div>
          <div className={styles.filler}>
            <Link to="/request-event">
              <button className={styles.btn2}>Add Event Request</button>
            </Link>
            <Link to="/request-post">
              <button className={styles.btn2}>Add Post Request</button>
            </Link>
          </div>
        </div>
      </section>
      {/* Post/Event Deletion Modal */}
      <DelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={question}
        title={"your post/event"}
        onConfirmDelete={""}
      />
      {/* Request Cancel Modal */}
      <DelModal
        open={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        icon={question}
        title={"your request"}
        onConfirmDelete={""}
      />
    </main>
  );
};

export default CmDashboard;
