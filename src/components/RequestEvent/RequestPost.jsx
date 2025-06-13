/// check line 106  i didn't implement the functionality /.....
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { eventsActions } from "../../store/events-slice";
import { getAuthUserId } from "../../util/auth.js";
import { generateUniqueIDFromStr } from "../../util/uniqueID.js";
import { database } from "../../firebase.js";
import { ref, onValue } from "firebase/database";
import { toast } from "sonner";

import Input from "../UI/Input";
import ColoreButton from "../UI/ColoredButton";
import Dropdown from "../EventsList/dropdown";

import cloud from "../../assets/icons/CreateClub/cloud_upload.png";
import styles from "../CreateClub/CreateClub.module.css";
import { useTranslation } from "react-i18next";

const RequestPost = () => {
  const { t } = useTranslation();

  const initialFormData = {
    clubId: "",
    clubName: "",
    clubManager: "",
    clubIcon: "",
    PostId: "",
    PostTitle: "",
    type: null,
    description: "",
    PostImage: "",
  };

  const chooseOption = [
    { label: t("req-post.type.post"), value: "post" },
    { label: t("req-post.type.announcement"), value: "announcement" },
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoEmpty, setIsInfoEmpty] = useState(false);
  const [isEvImageEmpty, setIsEvImageEmpty] = useState(false);
  const [clubName, setClubName] = useState(null);
  const [managerName, setManagerName] = useState(null);
  const [clubIcon, setClubIcon] = useState(null);

  const selectedType = useSelector((state) => state.events.selectedType);

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
        if (wantedData === "clubIcon") {
          setClubIcon(data);
        }
      });
    };
    if (clubName === null) {
      fetchWantedDataOfClub("clubName");
    }
    if (managerName === null) {
      fetchWantedDataOfClub("managerName");
    }
    if (clubIcon === null) {
      fetchWantedDataOfClub("clubIcon");
    }
    const addingBgImageAndIcon = async () => {
      if (imagePreview) {
        try {
          setFormData((prevFormData) => ({
            ...prevFormData,
            PostImage: imagePreview,
          }));
        } catch (error) {
          toast.error(t("req-post.error-uploading"));
        }
      }

      if (selectedType) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          clubName: clubName,
          clubManager: managerName,
          type: selectedType,
          clubIcon: clubIcon,
          clubId: userId,
          PostId: generateUniqueIDFromStr(prevFormData.PostTitle),
        }));
      }
    };

    addingBgImageAndIcon();
  }, [
    clubIcon,
    clubName,
    db,
    imagePreview,
    managerName,
    selectedType,
    t,
    userId,
  ]);

  const isEmptyChecker = (data) => {
    return data.trim().length === 0;
  };

  const formSubmittingHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // to check if the is any input field empty.
    const PostTitle = isEmptyChecker(formData.PostTitle);
    const description = isEmptyChecker(formData.description);
    const PostImage = isEmptyChecker(formData.PostImage);
    const choosenType = formData.type === null;

    if (PostTitle || description || PostImage || choosenType) {
      setIsInfoEmpty(true);
      if (PostImage) {
        setIsEvImageEmpty(true);
      }
      setIsSubmitting(false);
      toast.error(t("req-post.fill-fields"));
      return;
    }
    dispatch(
      eventsActions.addNewPost({
        info: formData,
        status: {
          clubId: formData.clubId,
          clubIcon: formData.clubIcon,
          clubName: formData.clubName,
          reqId: formData.PostId,
          PostId: formData.PostId,
          type: formData.type,
          id: formData.PostId,
          postName: formData.PostTitle,
          reqType: "post-request",
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
      <h1>{t("req-post.post")}</h1>
      <form onSubmit={formSubmittingHandler} className={styles["p-form"]}>
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
                <h1>{t("req-post.drag")}</h1>
              </div>
            )}
          </div>
        </section>
        <div className={styles["r-p-inputs"]}>
          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-post"]} ${
              isInfoEmpty && isEmptyChecker(formData.PostTitle)
                ? styles["input-empty"]
                : ""
            }`}
            scaleY={1.05}
            input={{
              id: "post-title",
              name: "PostTitle",
              type: "text",
              placeholder: t("req-post.title"),
              value: formData.PostTitle,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
          />
          <Dropdown
            identifier="choosen-type"
            width={195}
            isEmpty={isInfoEmpty}
            disabled={isSubmitting}
            list={chooseOption}
            placeholder={t("req-post.type.title")}
          />
        </div>
        <div className={styles["r-p-inputs"]}>
          <textarea
            className={
              isInfoEmpty && isEmptyChecker(formData.description)
                ? styles["input-empty"]
                : ""
            }
            id="club-description"
            name="description"
            rows="9"
            cols="146"
            placeholder={t("req-post.desc")}
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.pActions}>
          <ColoreButton red={true}>{t("req-post.cancel")}</ColoreButton>
          <ColoreButton type="submit" disabled={isSubmitting}>
            {t("req-post.create")}
          </ColoreButton>
        </div>
      </form>
    </main>
  );
};

export default RequestPost;
