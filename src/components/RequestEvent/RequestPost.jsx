/// check line 106  i didn't implement the functionality /.....
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { eventsActions } from "../../store/events-slice";
import { getAuthUserId } from "../../util/auth.js";
import { generateUniqueIDFromStr } from "../../util/uniqueID.js";
import { database } from "../../firebase.js";
import { ref, onValue } from "firebase/database";
import { toast } from "sonner";

import Input from "../UI/Input";
import ColoreButton from "../UI/ColoredButton";

import cloud from "../../assets/icons/CreateClub/cloud_upload.png";
import styles from "../CreateClub/CreateClub.module.css";

const RequestPost = () => {
  const initialFormData = {
    clubId: "",
    clubName: "",
    clubManager: "",
    clubIcon: "",
    PostId: "",
    PostTitle: "",
    description: "",
    PostImage: "",
  };

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
            clubName: clubName,
            clubManager: managerName,
            clubIcon: clubIcon,
            clubId: userId,
            PostId: generateUniqueIDFromStr(prevFormData.PostTitle),
          }));
        } catch (error) {
          toast.error("Error uploading the post image please try again");
        }
      }
    };

    addingBgImageAndIcon();
  }, [clubIcon, clubName, db, imagePreview, managerName, userId]);

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

    if (PostTitle || description || PostImage) {
      setIsInfoEmpty(true);
      if (PostImage) {
        setIsEvImageEmpty(true);
      }
      setIsSubmitting(false);
      toast.error(
        "Please review the information and ensure all fields are filled"
      );
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
          id: formData.PostId,
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
      <h1>Request Post</h1>
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
                <h1>Drag or Browse From computer files sorted automatically</h1>
              </div>
            )}
          </div>
        </section>
        <div className={styles["r-p-inputs"]}>
          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-1"]} ${
              isInfoEmpty && isEmptyChecker(formData.PostTitle)
                ? styles["input-empty"]
                : ""
            }`}
            scaleY={1.05}
            input={{
              id: "post-title",
              name: "PostTitle",
              type: "text",
              placeholder: "Post Title",
              value: formData.PostTitle,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
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
            cols="142"
            placeholder="Enter your request description here..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.pActions}>
          <ColoreButton red={true}>Cancel</ColoreButton>
          <ColoreButton type="submit" disabled={isSubmitting}>
            Create
          </ColoreButton>
        </div>
      </form>
    </main>
  );
};

export default RequestPost;
