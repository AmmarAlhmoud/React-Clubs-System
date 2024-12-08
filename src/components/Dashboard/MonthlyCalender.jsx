import { useState } from "react";
import { useSelector } from "react-redux";

import styles from "./MonthlyCalender.module.css";

const time = new Date();
const currentMonth = time.toLocaleString("default", { month: "long" });
const currentYear = time.getFullYear();

const MonthlyCalender = () => {
  const [daySelected, setDaySelected] = useState({
    dayNO: null,
    daySelected: null,
  });

  function handleEventDetails(evnt) {
    let eventNo = parseInt(evnt.target.innerHTML);
    setDaySelected(() => ({
      daySelected: true,
      dayNO: eventNo,
    }));
  }

  function getDayOfMonth(date) {
    // Create a Date object from the input date
    const dateObject = new Date(date);

    // Use getDate() to get the day of the month (1-31)
    const dayOfMonth = dateObject.getDate();

    // Return the day of the month
    return dayOfMonth;
  }

  const weeklyCalData = useSelector((state) => state.ui.weeklyCalData);
  let events;

  if (weeklyCalData !== null) {
    events = weeklyCalData;
  }

  // Display event details based on selected day beside the calender (currently only first event found).
  const matchingEvents = events?.filter(
    (event) => getDayOfMonth(event.Date) === daySelected.dayNO
  );

  return (
    <div className={styles.main}>
      <h1>Monthly Calender</h1>
      <section className={styles.calenders}>
        <div>
          <div>
            <span>{currentMonth}</span>
            <span>{currentYear}</span>
          </div>
          <div className={styles.monthTable}>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            {/* Generate an array of 31 JSX div elements and color the day if its an event day*/}

            {Array.from({ length: 31 }, (_, index) => {
              const event = events?.find(
                (ev) => getDayOfMonth(ev.Date) === index + 1
              ); // Find event for the current day

              return (
                <div
                  key={index + 1}
                  onClick={handleEventDetails}
                  className={event ? styles.eventDay : null}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
        {/* Selected day's event details */}
        <div className={styles.eventsTime}>
          {daySelected.daySelected ? (
            <>
              {matchingEvents?.length === 0 && (
                <div className={styles.noItem}>
                  There is no event in this day.
                </div>
              )}
              {matchingEvents?.length !== 0 &&
                matchingEvents.map((event, index) => {
                  return (
                    <div key={index} className={styles.itemContainer}>
                      <div className={styles.timeConatiner}>
                        <div>
                          <p>{event?.Stime?.label}</p>
                        </div>
                        <div>
                          <p>{event?.Etime?.label}</p>
                        </div>
                      </div>
                      <div
                        className={`${styles.eventContainer} ${
                          index % 2 === 0 ? styles.even : styles.odd
                        }`}
                      >
                        <div>
                          <p>{event?.EventName}</p>
                        </div>
                        <div className={styles.location}>
                          <p>{event?.location?.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          ) : (
            <h1>Select a day</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default MonthlyCalender;
