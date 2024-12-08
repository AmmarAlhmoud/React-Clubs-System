/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";

import styles from "./WeeklyCalender.module.css";

import WeeklyCalenderItem from "./WeeklyCalenderItem";
import BarLoader from "../UI/BarLoader";
import { getAuthUserType } from "../../util/auth";

const WeeklyCalender = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const weeklyCalData = useSelector((state) => state.ui.weeklyCalData);
  const cMEventsList = useSelector((state) => state.ui.cMEventsList);
  const sTEventsList = useSelector((state) => state.ui.sTEventsList);

  const userType = getAuthUserType();

  const handleSelectChange = (event) => {
    setSelectedDay(event.target.value);
  };

  let filteredEventsList;
  let currentEventsList;

  if (userType === "Ad") {
    currentEventsList = weeklyCalData;
  }

  if (userType === "Cl") {
    currentEventsList = cMEventsList;
  }

  if (userType === "St") {
    currentEventsList = sTEventsList;
  }

  if (selectedDay !== "" && currentEventsList !== null) {
    const filteredEvents = currentEventsList.filter((evItem) => {
      const eventDay = new Date(evItem.Date)
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      return eventDay === selectedDay.toLowerCase();
    });
    filteredEventsList = filteredEvents.map((eventItem, index) => {
      return (
        <WeeklyCalenderItem
          key={index}
          name={eventItem.clubName}
          location={eventItem.location.label}
          clubName={eventItem.clubName}
          clubLogo={eventItem.clubIcon}
          startTime={eventItem.Stime.label}
          endTime={eventItem.Etime.label}
        />
      );
    });
  }

  if (selectedDay === "" && currentEventsList !== null) {
    filteredEventsList = currentEventsList.map((eventItem, index) => {
      return (
        <WeeklyCalenderItem
          key={index}
          name={eventItem.clubName}
          location={eventItem.location.label}
          clubName={eventItem.clubName}
          clubLogo={eventItem.clubIcon}
          startTime={eventItem.Stime.label}
          endTime={eventItem.Etime.label}
        />
      );
    });
  }

  if (currentEventsList === null) {
    filteredEventsList = (
      <BarLoader
        noItemWeekly={userType === "Cl" ? false : true}
        noItemWeeklyCl={true}
      />
    );
  }

  if (selectedDay !== "" && filteredEventsList.length === 0) {
    filteredEventsList = (
      <p
        className={
          userType === "Cl" || userType === "St"
            ? styles.noEventCl
            : styles.noEvent
        }
      >
        There is no events at this day.
      </p>
    );
  }

  return (
    <form>
      <div className={styles.main}>
        <div>
          <h1>Weekly Calendar</h1>
          <select
            name="Day"
            id=""
            value={selectedDay}
            onChange={handleSelectChange}
          >
            <option value="">Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <section
          className={`${styles.events} ${
            currentEventsList === null ? styles.noItem : ""
          }`}
        >
          {filteredEventsList}
        </section>
      </div>
    </form>
  );
};

export default WeeklyCalender;
