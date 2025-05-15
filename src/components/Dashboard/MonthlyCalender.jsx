// src/components/MonthlyCalender.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./MonthlyCalender.module.css";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0 = Jan, … 4 = May
const monthName = now.toLocaleString("default", { month: "long" });

// how many days in this month?
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

// what weekday does the 1st fall on? (0=Sun, 1=Mon…6=Sat)
const firstWeekday = new Date(currentYear, currentMonth, 1).getDay();
// we want Monday=0…Sunday=6, so shift:
const offsetBlanks = (firstWeekday + 6) % 7;

export default function MonthlyCalender() {
  const [selectedDay, setSelectedDay] = useState(null);
  const events = useSelector((s) => s.ui.weeklyCalData) || [];

  // days that have at least one event
  const eventDays = new Set(events.map((e) => new Date(e.Date).getDate()));

  // events for the selected day
  const matching = selectedDay
    ? events.filter((e) => new Date(e.Date).getDate() === selectedDay)
    : [];

  const handleClick = (e) => {
    setSelectedDay(Number(e.target.innerText));
  };

  // helper to build classnames
  const cellClass = (dayNo) => {
    const dt = new Date(currentYear, currentMonth, dayNo);
    const wd = dt.getDay(); // 0=Sun,6=Sat
    const isWeekend = wd === 0 || wd === 6;
    const isEvent = eventDays.has(dayNo);

    return [
      styles.dayCell,
      isWeekend ? styles.weekendDay : null,
      isEvent ? styles.eventDay : null,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className={styles.main}>
      <h1>
        {monthName} {currentYear}
      </h1>
      <section className={styles.calenders}>
        <div>
          <div className={styles.header}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((wd, i) => (
              <div key={wd} className={i >= 5 ? styles.weekendDay : undefined}>
                {wd}
              </div>
            ))}
          </div>
          <div className={styles.monthTable}>
            {/* blank offset cells */}
            {Array.from({ length: offsetBlanks }).map((_, i) => (
              <div key={`b${i}`} className={styles.dayCell} />
            ))}

            {/* actual days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNo = i + 1;
              return (
                <div
                  key={dayNo}
                  className={cellClass(dayNo)}
                  onClick={handleClick}
                >
                  {dayNo}
                </div>
              );
            })}
          </div>
        </div>

        {/* details */}
        <div className={styles.eventsTime}>
          {selectedDay === null ? (
            <h1>Select a day</h1>
          ) : matching.length === 0 ? (
            <div className={styles.noItem}>There is no event on this day.</div>
          ) : (
            matching.map((ev, idx) => (
              <div key={idx} className={styles.itemContainer}>
                <div className={styles.timeConatiner}>
                  <p>{ev.Stime.label}</p>
                  <p>{ev.Etime.label}</p>
                </div>
                <div
                  className={`${styles.eventContainer} ${
                    idx % 2 === 0 ? styles.even : styles.odd
                  }`}
                >
                  <p>{ev.EventName}</p>
                  <p className={styles.location}>{ev.location.label}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
