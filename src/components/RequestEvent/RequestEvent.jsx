import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { eventsActions } from "../../store/events-slice.js";
import { generateUniqueIDFromStr } from "../../util/uniqueID.js";
import { getAuthUserId } from "../../util/auth.js";
import { database } from "../../firebase.js";
import { ref, onValue } from "firebase/database";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import DateInput from "./DateInput.jsx";
import Input from "../UI/Input.jsx";
import ColoreButton from "../UI/ColoredButton.jsx";
import EventDetailsPreview from "./EventDetailsPreview.jsx";
import Dropdown from "../EventsList/dropdown";

import cloud from "../../assets/icons/CreateClub/cloud_upload.png";

import styles from "./RequestEvent.module.css";

const RequestEvent = () => {
  const { t } = useTranslation();

  const initialFormData = {
    clubId: "",
    clubName: "",
    clubManager: "",
    managerEmail: "",
    clubCategories: [],
    EventId: "",
    EventName: "",
    Speakers: "",
    ContactNumber: "",
    Date: "",
    Stime: null, // Start time range
    Etime: null, // End time range
    location: null,
    description: "",
    EventImage: "",
    clubIcon: "",
  };

  const LocationList = [
    { value: "Nermin Terhan Hall", label: "Nermin Terhan Hall" },
    { value: "Aziz Sancar Hall", label: "Aziz Sancar Hall" },
    { value: "B-block 4th-floor", label: "B-block 4th-floor" },
    { value: "carsi Yerleske - Basche", label: "carsi Yerleske - Basche" },
  ];

  const TimeList = [
    { value: "00:00", label: "00:00" },
    { value: "00:30", label: "00:30" },
    { value: "01:00", label: "01:00" },
    { value: "01:30", label: "01:30" },
    { value: "02:00", label: "02:00" },
    { value: "02:30", label: "02:30" },
    { value: "03:00", label: "03:00" },
    { value: "03:30", label: "03:30" },
    { value: "04:00", label: "04:00" },
    { value: "04:30", label: "04:30" },
    { value: "05:00", label: "05:00" },
    { value: "05:30", label: "05:30" },
    { value: "06:00", label: "06:00" },
    { value: "06:30", label: "06:30" },
    { value: "07:00", label: "07:00" },
    { value: "07:30", label: "07:30" },
    { value: "08:00", label: "08:00" },
    { value: "08:30", label: "08:30" },
    { value: "09:00", label: "09:00" },
    { value: "09:30", label: "09:30" },
    { value: "10:00", label: "10:00" },
    { value: "10:30", label: "10:30" },
    { value: "11:00", label: "11:00" },
    { value: "11:30", label: "11:30" },
    { value: "12:00", label: "12:00" },
    { value: "12:30", label: "12:30" },
    { value: "13:00", label: "13:00" },
    { value: "13:30", label: "13:30" },
    { value: "14:00", label: "14:00" },
    { value: "14:30", label: "14:30" },
    { value: "15:00", label: "15:00" },
    { value: "15:30", label: "15:30" },
    { value: "16:00", label: "16:00" },
    { value: "16:30", label: "16:30" },
    { value: "17:00", label: "17:00" },
    { value: "17:30", label: "17:30" },
    { value: "18:00", label: "18:00" },
    { value: "18:30", label: "18:30" },
    { value: "19:00", label: "19:00" },
    { value: "19:30", label: "19:30" },
    { value: "20:00", label: "20:00" },
    { value: "20:30", label: "20:30" },
    { value: "21:00", label: "21:00" },
    { value: "21:30", label: "21:30" },
    { value: "22:00", label: "22:00" },
    { value: "22:30", label: "22:30" },
    { value: "23:00", label: "23:00" },
    { value: "23:30", label: "23:30" },
  ];

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    setIsInfoEmpty(false);
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Managing icons to upload ------ start
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Create a FileReader object
    const reader = new FileReader();
    // Set up the onload event handler
    reader.onload = () => {
      // Set the image preview URL in state
      setImagePreview(reader.result);
      setIsEvImageEmpty(false);
    };
    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  };

  const selectedDate = useSelector((state) => state.events.selectedDate);
  const selectedStartingTime = useSelector(
    (state) => state.events.selectedStartingTime
  );
  const selectedEndingTime = useSelector(
    (state) => state.events.selectedEndingTime
  );
  const selectedLocation = useSelector(
    (state) => state.events.selectedLocation
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoEmpty, setIsInfoEmpty] = useState(false);
  const [isEvImageEmpty, setIsEvImageEmpty] = useState(false);
  const [isDateEmpty, setIsDateEmpty] = useState(false);
  const [clubName, setClubName] = useState(null);
  const [managerName, setManagerName] = useState(null);
  const [categories, setCategories] = useState(null);
  const [clubIcon, setClubIcon] = useState(null);
  const [managerEmail, setManagerEmail] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = getAuthUserId();
  const db = database;

  useEffect(() => {
    const fetchWantedDataOfClub = (wantedData) => {
      const starCountRef = ref(db, "clubslist/" + userId + "/" + wantedData);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (wantedData === "clubName") {
          setClubName(data);
        }
        if (wantedData === "managerName") {
          setManagerName(data);
        }
        if (wantedData === "categories") {
          setCategories(data);
        }
        if (wantedData === "clubIcon") {
          setClubIcon(data);
        }
        if (wantedData === "email") {
          setManagerEmail(data);
        }
      });
    };
    if (clubName === null) {
      fetchWantedDataOfClub("clubName");
    }
    if (managerName === null) {
      fetchWantedDataOfClub("managerName");
    }
    if (categories === null) {
      fetchWantedDataOfClub("categories");
    }
    if (clubIcon === null) {
      fetchWantedDataOfClub("clubIcon");
    }
    if (managerEmail === null) {
      fetchWantedDataOfClub("email");
    }

    const addingEventImage = async () => {
      if (imagePreview) {
        try {
          setFormData((prevFormData) => ({
            ...prevFormData,
            EventImage: imagePreview,
          }));
        } catch (error) {
          toast.error(t("req-event.error-uploading"));
        }
      }

      if (
        selectedDate ||
        selectedStartingTime ||
        selectedEndingTime ||
        selectedLocation
      ) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          Date: selectedDate,
          Stime: selectedStartingTime,
          Etime: selectedEndingTime,
          location: selectedLocation,
          clubName: clubName,
          clubManager: managerName,
          managerEmail: managerEmail,
          clubCategories: categories,
          clubIcon: clubIcon,
          clubId: userId,
          EventId: generateUniqueIDFromStr(prevFormData.EventName),
        }));
      }
    };

    addingEventImage();
  }, [
    imagePreview,
    selectedDate,
    selectedEndingTime,
    selectedLocation,
    selectedStartingTime,
    userId,
    db,
    managerName,
    clubName,
    categories,
    clubIcon,
    managerEmail,
    t,
  ]);

  const isEmptyChecker = (data) => {
    return data.trim().length === 0;
  };

  const formSubmittingHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // to check if the is any input field empty.
    const EventName = isEmptyChecker(formData.EventName);
    const Speakers = isEmptyChecker(formData.Speakers);
    const ContactNumber = isEmptyChecker(formData.ContactNumber);
    const Date = isEmptyChecker(formData.Date);
    const Stime = formData.Stime === null;
    const Etime = formData.Etime === null;
    const location = formData.location === null;
    const description = isEmptyChecker(formData.description);
    const EventImage = isEmptyChecker(formData.EventImage);

    if (
      EventName ||
      Speakers ||
      ContactNumber ||
      Date ||
      Stime ||
      Etime ||
      location ||
      description ||
      EventImage
    ) {
      setIsInfoEmpty(true);
      if (EventImage) {
        setIsEvImageEmpty(true);
      }
      if (Date) {
        setIsDateEmpty(true);
      }
      setIsSubmitting(false);
      toast.error(t("req-event.fill-info"));
      return;
    }

    dispatch(
      eventsActions.addNewEvent({
        info: formData,
        status: {
          clubId: formData.clubId,
          clubIcon: formData.clubIcon,
          clubName: formData.clubName,
          reqId: formData.EventId,
          EventId: formData.EventId,
          id: formData.EventId,
          eventName: formData.EventName,
          location: formData.location.value,
          reqType: "event-request",
          status: "pending",
        },
      })
    );
    navigate("/events-list");
    setIsSubmitting(false);
    setImagePreview(null);
    setFormData(initialFormData);
  };

  return (
    <main className={styles.container}>
      <h1>{t("req-event.event")}</h1>
      <section className={styles.insideContainer}>
        {/* <EventDetails from="req-event" data={formData} /> */}
        <form
          onSubmit={formSubmittingHandler}
          className={`${styles["form"]} ${styles.reqEventForm}`}
        >
          <section
            className={`${styles["images-sec"]} ${
              !selectedFile && isEvImageEmpty ? styles["input-empty"] : ""
            }`}
          >
            <div className={styles.upBg}>
              {/* upload event file */}
              <input
                type="file"
                id="clubBg"
                name="club-bg"
                className={styles.bgUploadInp}
                onChange={handleFileUpload}
                disabled={isSubmitting}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.bgPreview}
                />
              )}
              {!selectedFile && (
                <div className={styles.upBg}>
                  <img src={cloud} alt="upload" />
                  <h1>{t("req-event.drag")}</h1>
                </div>
              )}
            </div>
          </section>
          <div className={styles["inputs"]}>
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-1"]} ${
                isInfoEmpty && isEmptyChecker(formData.EventName)
                  ? styles["input-empty"]
                  : ""
              }`}
              scaleY={1.05}
              input={{
                id: "event-name",
                name: "EventName",
                type: "text",
                placeholder: t("req-event.name"),
                value: formData.EventName,
                onChange: handleInputChange,
                disabled: isSubmitting,
              }}
            />
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-2"]} ${
                isInfoEmpty && isEmptyChecker(formData.Speakers)
                  ? styles["input-empty"]
                  : ""
              }`}
              scaleY={1.05}
              input={{
                id: "speakers-id",
                name: "Speakers",
                type: "text",
                placeholder: t("req-event.speakers"),
                value: formData.Speakers,
                onChange: handleInputChange,
                disabled: isSubmitting,
              }}
            />
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-1"]} ${
                isInfoEmpty && isEmptyChecker(formData.ContactNumber)
                  ? styles["input-empty"]
                  : ""
              }`}
              scaleY={1.05}
              input={{
                id: "contact-number",
                name: "ContactNumber",
                type: "text",
                placeholder: t("req-event.number"),
                value: formData.ContactNumber,
                onChange: handleInputChange,
                disabled: isSubmitting,
              }}
              s
            />
          </div>

          <div className={styles["inputs2"]}>
            <DateInput
              disabled={isSubmitting}
              isEmpty={isDateEmpty}
              startTyping={isInfoEmpty}
            />
            <Dropdown
              identifier="starting-time"
              width={135}
              isEmpty={isInfoEmpty}
              disabled={isSubmitting}
              list={TimeList}
              placeholder={t("req-event.start-time")}
            />
            <Dropdown
              identifier="ending-time"
              width={135}
              isEmpty={isInfoEmpty}
              disabled={isSubmitting}
              list={TimeList}
              placeholder={t("req-event.end-time")}
            />
            <Dropdown
              identifier="location"
              width={145}
              isEmpty={isInfoEmpty}
              disabled={isSubmitting}
              list={LocationList}
              placeholder={t("req-event.location")}
            />
          </div>
          <div className={styles["inputs"]}>
            <textarea
              className={
                isInfoEmpty && isEmptyChecker(formData.description)
                  ? styles["input-empty"]
                  : ""
              }
              id="club-description"
              name="description"
              rows="8"
              cols="79"
              placeholder={t("req-event.desc")}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.actions}>
            <ColoreButton red={true}>{t("req-event.cancel")}</ColoreButton>
            <ColoreButton type="submit" disabled={isSubmitting}>
              {t("req-event.request")}
            </ColoreButton>
          </div>
        </form>
        <div className={styles.spacer} />
        <EventDetailsPreview data={formData} />
      </section>
    </main>
  );
};

export default RequestEvent;
