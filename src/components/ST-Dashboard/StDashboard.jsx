import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { uiActions } from "../../store/ui-slice";

import RecentEventItem from "../CM-Dashboard/RecentEventItem";
import WeeklyCalender from "../Dashboard/WeeklyCalender";

import styles from "./StDashboard.module.css";

import BarLoader from "../UI/BarLoader";

let initialLoad = true;

const StDashboard = () => {
  const [isFetching, setIsFetching] = useState(false);
  const db = database;
  const dispatch = useDispatch();

  const clubsListForSt = useSelector((state) => state.ui.clubsListForSt);
  const sTEventsList = useSelector((state) => state.ui.sTEventsList);

  useEffect(() => {
    const fetchAllClubs = () => {
      setIsFetching(true);
      dispatch(uiActions.setIsStDashLoading(true));
      const starCountRef1 = ref(db, "clubslist");
      onValue(starCountRef1, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.replaceClubsListForSt(data));
        setIsFetching(false);
        dispatch(uiActions.setIsStDashLoading(false));
      });
    };

    if (initialLoad) {
      fetchAllClubs();
      initialLoad = false;
    }

    if (initialLoad === false && clubsListForSt !== null) {
      Object.values(clubsListForSt).map((club) => {
        const fetchedEventsList = club?.events;
        if (fetchedEventsList !== undefined) {
          dispatch(uiActions.setSTEventsList(Object.values(fetchedEventsList)));
        }
      });
    }
  }, [clubsListForSt, db, dispatch]);

  return (
    <main className={styles.container}>
      {/* Recent Events Section */}
      <section className={styles.recent}>
        <h1>Recent New Events</h1>
        <div className={styles.renderedEvents}>
          {sTEventsList === null && isFetching && (
            <BarLoader noItemWeeklyST={true} />
          )}
          {sTEventsList !== null &&
            !isFetching &&
            sTEventsList?.map((event, index) => (
              <RecentEventItem
                key={index}
                clubName={event.clubName}
                clubIcon={event.clubIcon}
                event={event}
              />
            ))}
        </div>
      </section>
      {/* Weekly Calender Section */}
      <section className={styles.calender}>
        <WeeklyCalender />
      </section>
    </main>
  );
};

export default StDashboard;
