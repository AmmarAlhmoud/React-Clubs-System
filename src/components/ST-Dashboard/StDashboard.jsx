import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { uiActions } from "../../store/ui-slice";

import RecentEventItem from "../CM-Dashboard/RecentEventItem";
import WeeklyCalender from "../Dashboard/WeeklyCalender";
import RecentEventsCarousel from "../CM-Dashboard/RecentEventsCarousel";

import styles from "./StDashboard.module.css";

import BarLoader from "../UI/BarLoader";
import { useTranslation } from "react-i18next";

const StDashboard = () => {
  const { t } = useTranslation();
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const db = database;

  const clubsListForSt = useSelector((state) => state.ui.clubsListForSt);
  const sTEventsList = useSelector((state) => state.ui.sTEventsList);

  // Fetch clubs list from Firebase
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

    fetchAllClubs();
  }, [db, dispatch]);

  // Transform clubs list into a unified events list once data is loaded
  useEffect(() => {
    if (clubsListForSt !== null) {
      const allEvents = [];
      Object.values(clubsListForSt).forEach((club) => {
        const fetchedEventsList = club?.events;
        if (fetchedEventsList) {
          allEvents.push(...Object.values(fetchedEventsList));
        }
      });
      dispatch(uiActions.setSTEventsList(allEvents));
    }
  }, [clubsListForSt, dispatch]);

  // Utility function to compare dates
  const isCloserDate = (currentDate, isoStringDate) => {
    const comparedYear = parseInt(isoStringDate.slice(0, 4), 10);
    const comparedMonth = parseInt(isoStringDate.slice(5, 7), 10) - 1;
    const comparedDay = parseInt(isoStringDate.slice(8, 10), 10);

    const currentDateInDays =
      currentDate.getFullYear() * 365 +
      currentDate.getMonth() * 30 +
      currentDate.getDate();
    const comparedDateInDays =
      comparedYear * 365 + comparedMonth * 30 + comparedDay;

    return Math.abs(currentDateInDays - comparedDateInDays) > 0;
  };

  // Determine the next upcoming event
  let myNextEvent = null;

  if (Array.isArray(sTEventsList) && sTEventsList.length > 0) {
    const closestEventIndex = sTEventsList?.reduce(
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

    if (closestEventIndex !== null) {
      myNextEvent = sTEventsList[closestEventIndex];
    }
  }

  // Format event date
  let formattedDate;

  if (myNextEvent !== null) {
    formattedDate = new Date(myNextEvent?.Date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const month = formattedDate.split(" ")[0];
    formattedDate = formattedDate.replace(month, t(`months.${month}`));
  }

  return (
    <main className={styles.container}>
      {/* Recent Events Section */}
      <section className={styles.recent}>
        <h1>{t("st-dashboard.recent-new-events")}</h1>
        <div className={styles.renderedEvents}>
          {isFetching && <BarLoader noItemWeeklyST={true} />}

          {Array.isArray(sTEventsList) && sTEventsList.length > 0 && (
            <div className={styles.renderedEvents}>
              <RecentEventsCarousel items={sTEventsList} />
            </div>
          )}
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
