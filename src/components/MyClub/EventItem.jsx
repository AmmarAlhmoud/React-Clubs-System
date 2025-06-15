import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { clubActions } from "../../store/club-slice.js";
import { checkAuthClUserType } from "../../util/auth.js";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import DelModal from "./DelModal.jsx";

import styles from "./EventItem.module.css";

const EventItem = ({ name, icon, event, canEdit }) => {
  const { t } = useTranslation();

  // For Event Deletion Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // For editing inputs mode
  const [isEditMode, setIsEditMode] = useState(false);
  // State to store the uploaded image
  const [uploadedImage, setUploadedImage] = useState(null);

  const dispatch = useDispatch();

  const eventNameRef = useRef();
  const eventDescRef = useRef();
  const eventDateRef = useRef();
  const eventSTimeRef = useRef();
  const eventETimeRef = useRef();
  const eventLocationRef = useRef();
  const eventSpeakersRef = useRef();

  let formattedDate = new Date(event.Date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const month = formattedDate.split(" ")[0];
  formattedDate = formattedDate.replace(month, t(`months.${month}`));

  const formatDateForInput = (dateString) => {
    // Parse the ISOString date, considering time zone if needed
    const date = new Date(dateString);

    // Optional: Adjust for time zone difference if necessary
    //  - You'll need additional information about the original time zone
    //  const adjustedDate = new Date(date.getTime() + offsetInMilliseconds);

    // Get the year, month, and day components for consistent formatting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month (0-indexed)
    const day = String(date.getDate()).padStart(2, "0");

    // Return a formatted date string (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
  };

  function addCommas(text) {
    const words = text.trim().split(/\s+/); // Split by whitespace, trimming extra spaces

    // Handle edge case of empty string or single word
    if (words.length <= 1) {
      return text;
    }

    // Add comma after first word and join back with spaces
    return words[0] + ", " + words.slice(1).join(" ");
  }

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // Textarea autosize
  function autoGrow(event) {
    const element = event.target;
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  // Handle file input change
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Create a FileReader object
    const reader = new FileReader();
    // Set up the onload event handler
    reader.onload = () => {
      // Set the image preview URL in state
      setUploadedImage(reader.result);
    };
    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  };

  const deleteEventHandler = () => {
    dispatch(clubActions.setDeletedEvent(event));
  };

  const getTimePeriod = (dateString) => {
    // Parse the ISOString date
    const date = new Date(dateString);

    // Get the current date and time
    const now = new Date();

    // Calculate the time difference in milliseconds
    const diffInMs = now - date;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    // Determine the most relevant unit (considering 20-hour threshold)
    let timePeriod;
    if (days) {
      timePeriod = `${days} ${t("club-page.event-item.day")}${
        days > 1 ? "s" : ""
      }`;
    } else if (hours > 20) {
      timePeriod = `${hours} ${t("club-page.event-item.hour")}${
        hours > 1 ? "s" : ""
      }`;
    } else if (hours > 0) {
      // Only show hours if greater than 0 and less than or equal to 20
      timePeriod = `${hours} ${t("club-page.event-item.hour")}${
        hours > 1 ? "s" : ""
      }`;
    } else if (minutes > 0) {
      // Include minutes if greater than 0
      timePeriod = `${minutes} ${t("club-page.event-item.minute")}${
        minutes > 1 ? "s" : ""
      }`;
    } else {
      timePeriod = `${seconds} ${t("club-page.event-item.second")}${
        seconds > 1 ? "s" : ""
      }`;
    }

    // Return the formatted time period
    return timePeriod;
  };

  function convertTimeToObject(timeString) {
    // Split the time string by separators (colon or space)
    const timeParts = timeString.split(/[: ]+/);

    // Validate and handle different input formats
    let hours;
    let minutes = 0;

    if (timeParts.length === 1) {
      // Single input: check if numeric (hours) or invalid format
      if (isNaN(parseInt(timeParts[0]))) {
        toast.error(t("club-page.event-item.invalid-time"));
        return null;
      } else {
        hours = parseInt(timeParts[0]);
      }
    } else if (timeParts.length === 2) {
      // Two inputs (hours and minutes)
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1]);
    } else {
      // Invalid format (return default)
      toast.error(t("club-page.event-item.invalid-time"));
      return null;
    }

    // Ensure valid values (non-negative)
    hours = Math.max(0, hours);
    minutes = Math.max(0, minutes);

    // Calculate total seconds
    const timeInSecs = hours * 3600 + minutes * 60;

    // Format the time string with leading zeros
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Create the time object with label (optional) and formatted time value
    return { label: formattedTime, value: formattedTime };
  }

  const addStringToObject = (str) => ({ label: str });

  function areDatesNotEqual(isoDateString, textDate) {
    // 1. Parse the ISO string into a reliable Date object
    const isoDate = new Date(isoDateString);

    // 2. Handle potential ambiguity in textDate:
    //    - Try parsing as ISO string first (most likely format)
    //    - If parsing fails, create a Date object with minimal information
    let parsedDate;
    try {
      parsedDate = new Date(textDate);
    } catch (error) {
      const [year, month, day] = textDate.split(/\s*[-\/\.]\s*/); // Split on separators
      parsedDate = new Date(year, month - 1, day); // Create with year, month (0-indexed), day
    }

    // 3. Compare only year, month, and day using getters
    return (
      isoDate.getFullYear() !== parsedDate.getFullYear() &&
      isoDate.getMonth() !== parsedDate.getMonth() &&
      isoDate.getDate() !== parsedDate.getDate()
    );
  }

  const convertDateToIsoString = (dateText) => {
    // Create a Date object from the text (handles various formats)
    const dateObject = new Date(dateText);

    // Check if the date is valid (avoid errors)
    if (isNaN(dateObject.getTime())) {
      return null; // Return null for invalid dates
    }

    // Return the ISO string representation
    return dateObject.toISOString();
  };

  const eventEditSubmitHandler = (input) => {
    input.preventDefault();

    const newName = eventNameRef.current.value;
    const newDesc = eventDescRef.current.value;
    const newDate = eventDateRef.current.value;
    const newStime = convertTimeToObject(eventSTimeRef.current.value);
    const newEtime = convertTimeToObject(eventETimeRef.current.value);
    const newLocation = addStringToObject(eventLocationRef.current.value);
    const newSpeakers = eventSpeakersRef.current.value;
    // console.log(newLocation);
    // console.log(areDatesNotEqual(newDate, event.Date));

    if (
      newName !== event.EventName ||
      newDesc !== event.description ||
      areDatesNotEqual(newDate, event.Date) ||
      (newStime.label !== event.Stime.label && newStime !== null) ||
      (newEtime.label !== event.Etime.label && newEtime !== null) ||
      newLocation.label !== event.location.label ||
      newSpeakers !== event.Speakers ||
      uploadedImage !== null
    ) {
      dispatch(
        clubActions.setReqEditEvent({
          info: {
            ...event,
            EventName: newName !== event.EventName ? newName : event.EventName,
            description:
              newDesc !== event.description ? newDesc : event.description,
            EventImage:
              uploadedImage !== null ? uploadedImage : event.EventImage,
            Date: areDatesNotEqual(newDate, event.Date)
              ? convertDateToIsoString(newDate)
              : event.Date,
            Stime:
              newStime.label !== event.Stime.label ? newStime : event.Stime,
            Etime:
              newEtime.label !== event.Etime.label ? newEtime : event.Etime,
            location:
              newLocation.label !== event.location.label
                ? newLocation
                : event.location,
            Speakers:
              newSpeakers !== event.Speakers ? newSpeakers : event.Speakers,
          },
          status: {
            clubId: event.clubId,
            clubName: event.clubName,
            clubIcon: event.clubIcon,
            EventId: event.EventId,
            eventName: event.EventName,
            location: event.location.value,
            id: event.EventId,
            reqType: "edit-event",
            status: "pending",
          },
        })
      );
      setIsEditMode((prev) => !prev);
      setUploadedImage(null);
    } else {
      setIsEditMode((prev) => !prev);
      setUploadedImage(null);
      toast.error(t("club-page.event-item.change-info"));
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div>
          <img src={icon} alt="icon" />
          <div>
            <h1>{name}</h1>
            <h2>{getTimePeriod(event.createdDate)}</h2>
          </div>
        </div>
        <div>
          {canEdit && checkAuthClUserType() && (
            <div>
              <button
                type="button"
                onClick={toggleEditMode}
                className={`${styles["events-btn"]} ${
                  isEditMode ? styles.editModeBtn : null
                }`}
              >
                {isEditMode
                  ? `${t("club-page.event-item.editing")}`
                  : `${t("club-page.event-item.edit-event")}`}
              </button>
              <button
                className={styles["events-btn"]}
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
                {t("club-page.event-item.del-event")}
              </button>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={eventEditSubmitHandler}>
        {isEditMode ? (
          <input
            ref={eventNameRef}
            type="text"
            name="clubTitle"
            defaultValue={event.EventName}
          />
        ) : (
          <p>{event.EventName}</p>
        )}
        {isEditMode ? (
          <textarea
            ref={eventDescRef}
            name="clubDesc"
            defaultValue={event.description}
            onChange={autoGrow}
            onMouseEnter={autoGrow}
          />
        ) : (
          <p>{event.description}</p>
        )}
        {isEditMode ? (
          <div className={styles.detailsInputs}>
            <div className={styles.groupedInps}>
              <input
                ref={eventDateRef}
                type="date"
                name="date"
                defaultValue={formatDateForInput(event.Date)}
              />
              <input
                ref={eventSTimeRef}
                className={styles.hourS}
                type="text"
                name="hourS"
                defaultValue={event.Stime?.label}
              />
              <input
                ref={eventETimeRef}
                className={styles.hourE}
                type="text"
                name="hourE"
                defaultValue={event.Etime?.label}
              />
              <input
                ref={eventLocationRef}
                className={styles.location}
                type="text"
                name="location"
                defaultValue={event.location?.label}
              />
            </div>
            <input
              ref={eventSpeakersRef}
              type="text"
              name="speakers"
              defaultValue={addCommas(event.Speakers)}
              className={styles.speakersInp}
            />
          </div>
        ) : (
          <div className={styles.moreEventDetails}>
            <h3>
              {t("club-page.event-item.date")} <span>{formattedDate}</span>
            </h3>
            <h3>
              {t("club-page.event-item.time")}{" "}
              <span>
                {event.Stime?.label} - {event.Etime?.label}
              </span>
            </h3>
            <h3>
              {t("club-page.event-item.location")}{" "}
              <span>{event.location?.label}</span>
            </h3>
            <h3 className={styles.eventSpeakers}>
              {t("club-page.event-item.speakers")} {addCommas(event.Speakers)}
            </h3>
          </div>
        )}
        {isEditMode ? (
          <div className={styles.images}>
            <img
              src={uploadedImage || event.EventImage}
              alt="event image"
              className={styles.preview}
            />
            <label htmlFor="file-upload" className={styles.imgUpload}>
              {t("club-page.event-item.edit")}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileUpload}
              className={styles.previewImgInput}
            />
          </div>
        ) : (
          <img
            src={event.EventImage}
            alt="event image"
            className={styles.preview}
          />
        )}
        {isEditMode && (
          <div className={styles.editBtns}>
            <button onClick={toggleEditMode}>
              {t("club-page.event-item.cancel")}
            </button>
            <button type="submit">{t("club-page.event-item.apply")}</button>
          </div>
        )}
      </form>
      <DelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={icon}
        title={`${event?.EventName} ?`}
        onConfirmDelete={deleteEventHandler}
      />
    </div>
  );
};

export default EventItem;
