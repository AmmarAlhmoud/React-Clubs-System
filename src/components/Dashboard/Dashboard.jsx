import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase.js";
import { ref, onValue } from "firebase/database";
import { uiActions } from "../../store/ui-slice.js";
import RequestItem from "./RequestItem.jsx";
import WeeklyCalender from "./WeeklyCalender.jsx";
import MonthlyCalender from "./MonthlyCalender.jsx";

import waitingIcon from "../../assets/images/Dashboard/waitingIcon.png";
import acceptedIcon from "../../assets/images/Dashboard/acceptedIcon.png";
import deniedIcon from "../../assets/images/Dashboard/deniedIcon.png";
import totalClubsIcon from "../../assets/images/Dashboard/totalClubsIcon.png";

import styles from "./Dashboard.module.css";
import BarLoader from "../UI/BarLoader.jsx";

let initialLoad = true;

const Dashboard = () => {
  const db = database;
  const dispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const fetchedClubsList = useSelector((state) => state.ui.clubsList);
  const fetchedRequestsList = useSelector((state) => state.ui.requestsList);

  useEffect(() => {
    const fetchData = () => {
      setIsFetching(true);
      const starCountRef1 = ref(db, "clubslist");
      onValue(starCountRef1, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.replaceClubsList(data));
      });
      const starCountRef2 = ref(db, "req-status-list");
      onValue(starCountRef2, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.replaceRequestsList(data));
        setIsFetching(false);
      });
    };

    if (initialLoad) {
      fetchData();
      initialLoad = false;
    }

    if (initialLoad === false && fetchedClubsList !== null) {
      Object.values(fetchedClubsList).map((club) => {
        const fetchedEventsList = club?.events;
        if (fetchedEventsList !== undefined) {
          dispatch(
            uiActions.setWeeklyCalData(Object.values(fetchedEventsList))
          );
        }
      });
    }
  }, [db, dispatch, fetchedClubsList]);

  let requestsList = [];
  let pendingRequestsList = [];
  let rejectedRequestsList = [];
  let acceptedRequestsList = [];
  let acceptedRequestedEventsList = [];

  if (fetchedRequestsList !== null) {
    if (Object.keys(fetchedRequestsList).length !== 0) {
      Object.values(fetchedRequestsList).map((reqTypeList) => {
        const reqList = reqTypeList;
        const requestsListOfClub = Object.values(reqList);
        requestsListOfClub.reverse().map((request) => {
          requestsList.push(
            Object.values(request).map((req, index) => {
              if (req.status === "pending") {
                pendingRequestsList.push(1);
                return (
                  <RequestItem
                    key={index}
                    name={req.clubName}
                    icon={req.clubIcon}
                    type={req.reqType}
                    reqDate={req.reqDate}
                  />
                );
              }
              if (req.status === "rejected") {
                rejectedRequestsList.push(1);
              }
              if (req.status === "accepted") {
                acceptedRequestsList.push(1);
              }
              if (
                req.reqType === "event-request" &&
                req.status === "accepted"
              ) {
                acceptedRequestedEventsList.push(1);
              }
            })
          );
        });
      });
    }
  }

  let totalClubsNum = 0;
  if (fetchedClubsList !== null) {
    totalClubsNum = Object.keys(fetchedClubsList).length;
  }

  // console.log(eventsList);

  const hasAllUndefined = requestsList.every((subArray) =>
    subArray.every((item) => item === undefined)
  );

  // no requests and loading
  if (hasAllUndefined && isFetching) {
    requestsList = <BarLoader noReq={true} />;
  }

  // if there is no requests in the request list
  if (hasAllUndefined && !isFetching) {
    requestsList = (
      <p className={styles.noItem}>There is no requests at the moment!</p>
    );
  }

  return (
    <main className={styles.container}>
      {/* ----- Requests start ----- */}
      <section className={styles.requests}>
        <h1>Requests</h1>
        {requestsList}
      </section>
      {/* ----- Requests end ----- */}
      {/* ----- Stats start ----- */}
      <section className={styles.stats}>
        <div>
          <div className={styles.statsW}>
            <img src={waitingIcon} alt="waiting" />
            <h1>Waiting</h1>
            <h2>
              <span>{pendingRequestsList?.length || 0}</span>Requests
            </h2>
          </div>
        </div>
        <div>
          <div className={styles.statsA}>
            <img src={acceptedIcon} alt="accepted" />
            <h1>Accepted</h1>
            <h2>
              <span>{acceptedRequestsList?.length || 0}</span>Requests
            </h2>
            <h2>
              <span>{acceptedRequestedEventsList?.length || 0}</span>Event
              Requests
            </h2>
          </div>
        </div>
        <div>
          <div className={styles.statsD}>
            <img src={deniedIcon} alt="denied" />
            <h1>Denied</h1>
            <h2>
              <span>{rejectedRequestsList?.length || 0}</span>Requests
            </h2>
          </div>
        </div>
        <div>
          <div className={styles.statsTC}>
            <h1>Total Clubs</h1>
            <img src={totalClubsIcon} alt="total clubs" />
            <h2>{totalClubsNum}</h2>
          </div>
        </div>
      </section>
      {/* ----- Stats end ----- */}
      {/* ----- Calender start ----- */}
      <section className={styles.calender}>
        <WeeklyCalender />
        <MonthlyCalender />
      </section>
      {/* ----- Calender end ----- */}
    </main>
  );
};

export default Dashboard;
