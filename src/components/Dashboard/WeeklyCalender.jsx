/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";

import styles from "./WeeklyCalender.module.css";

import WeeklyCalenderItem from "./WeeklyCalenderItem";
import BarLoader from "../UI/BarLoader";
import { getAuthUserType } from "../../util/auth";
import { useTranslation } from "react-i18next";

const WeeklyCalender = () => {
  const { t } = useTranslation();

  const [selectedDay, setSelectedDay] = useState("");
  const weeklyCalData = useSelector((state) => state.ui.weeklyCalData);
  const cMEventsList = useSelector((state) => state.ui.cMEventsList);
  const sTEventsList = useSelector((state) => state.ui.sTEventsList);
  const isCmDashLoading = useSelector((state) => state.ui.isCmDashLoading);
  const isStDashLoading = useSelector((state) => state.ui.isStDashLoading);

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

  if (currentEventsList === null && isCmDashLoading) {
    filteredEventsList = (
      <BarLoader
        noItemWeekly={userType === "Cl" ? false : true}
        noItemWeeklyCl={true}
      />
    );
  }

  if (
    (currentEventsList === null && isCmDashLoading === false) ||
    (isStDashLoading === false && userType === "St")
  ) {
    filteredEventsList = (
      <p
        className={
          userType === "Cl" || userType === "St"
            ? styles.noEventCl
            : styles.noEvent
        }
      >
        {t("dashboard.weekly-calendar.no-events-currently")}
      </p>
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
        {t("dashboard.weekly-calendar.no-events-this-day")}
      </p>
    );
  }

  return (
    <form>
      <div className={styles.main}>
        <div>
          <h1>{t("dashboard.weekly-calendar.title")}</h1>
          <select
            name="Day"
            id=""
            value={selectedDay}
            onChange={handleSelectChange}
          >
            <option value="">{t("dashboard.weekly-calendar.day")}</option>
            <option value="Monday">{t("dashboard.weekly-calendar.mon")}</option>
            <option value="Tuesday">
              {t("dashboard.weekly-calendar.tues")}
            </option>
            <option value="Wednesday">
              {t("dashboard.weekly-calendar.wed")}
            </option>
            <option value="Thursday">
              {t("dashboard.weekly-calendar.thur")}
            </option>
            <option value="Friday">{t("dashboard.weekly-calendar.fri")}</option>
            <option value="Saturday">
              {t("dashboard.weekly-calendar.sat")}
            </option>
            <option value="Sunday">{t("dashboard.weekly-calendar.sun")}</option>
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
