import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clubActions } from "../../../store/club-slice";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";
import { getAuthUserId, getAuthUserType } from "../../../util/auth";
import { toast } from "sonner";

import cloud from ".././../../assets/icons/CreateClub/cloud_upload.png";
import Input from "../../UI/Input";
import SelectInput from "../../EventsList/SelectInput";
import BarLoader from "../../UI/BarLoader";

import styles from "./ClubEditReq.module.css";

const ClubEditReq = ({ title, className, type, Editable, children }) => {
  const userId = getAuthUserId();
  const userType = getAuthUserType();
  const Cl = userType === "Cl";
  const Ad = userType === "Ad";
  const EditClubReqForAd =
    userType === "Ad" && window.location.pathname.startsWith("/requests/");
  const [isFetching, setIsFetching] = useState(false);

  let clubData;

  const currentClub = useSelector((state) => state.club.currentClubInfo);
  const editOldClubInfo = useSelector((state) => state.club.editOldClubInfo);
  const editNewClubInfo = useSelector((state) => state.club.editNewClubInfo);
  const submittingName = useSelector((state) => state.club.submittingName);

  if (Cl && type === "edit-my-club") {
    clubData = currentClub;
  }

  if (Ad && type === "edit-club-Ad") {
    clubData = currentClub;
  }

  if (type === "old-info") {
    clubData = editOldClubInfo;
  }

  if (type === "new-info") {
    clubData = editNewClubInfo;
  }

  const initialFormData = {
    clubId: clubData.clubId,
    clubName: clubData.clubName,
    studentId: clubData.studentId,
    managerName: clubData.managerName,
    email: clubData.email,
    phoneNumber: clubData.phoneNumber,
    description: clubData.description,
    categories: clubData.categories,
    clubBgImage: clubData.clubBgImage,
    createdData: clubData.createdData || new Date().toISOString(),
    clubIcon: clubData.clubIcon,
    events: clubData.events || {},
    posts: clubData.posts || {},
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    // setIsInfoEmpty(false);
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
      setIsBgEmpty(false);
    };
    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  };

  const [selectedClubIcon, setSelectedClubIcon] = useState(null);
  const [clubIconPreview, setClubIconPreview] = useState(null);

  const handleClubIconUpload = (event) => {
    const file = event.target.files[0];
    setSelectedClubIcon(file);

    const reader = new FileReader();
    reader.onload = () => {
      setClubIconPreview(reader.result);
      setIsIcEmpty(false);
    };

    reader.readAsDataURL(file);
  };

  const selectedCategories = useSelector(
    (state) => state.club.selectedCategories
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoEmpty, setIsInfoEmpty] = useState(false);
  const [isBgEmpty, setIsBgEmpty] = useState(false);
  const [isIcEmpty, setIsIcEmpty] = useState(false);
  const [clubNameChanged, setClubNameChanged] = useState(false);
  const [clubPhoneNumberChanged, setClubPhoneNumberChanged] = useState(false);
  const [clubDescriptionChanged, setClubDescriptionChanged] = useState(false);
  const [clubCategoriesChanged, setClubCategoriesChanged] = useState(false);
  const [clubImageChanged, setClubImageChanged] = useState(false);
  const [clubIconChanged, setClubIconChanged] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editClubId } = useParams();
  const db = database;

  const isNewData = (oldInfo, newInfo) => {
    if (typeof oldInfo === "string") {
      return oldInfo?.trim() !== newInfo?.trim();
    }
    return oldInfo?.length !== newInfo?.length;
  };

  useEffect(() => {
    const addingBgImageAndIcon = async () => {
      try {
        if (imagePreview !== null) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            clubBgImage: imagePreview,
          }));
        }
        if (clubIconPreview !== null) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            clubIcon: clubIconPreview,
          }));
        }
        if (selectedCategories.length !== 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            categories: selectedCategories,
          }));
        }
      } catch (error) {
        toast.error("Error uploading the new images please try again");
      }
    };

    const fetchCurrentUserClub = (clubId, from) => {
      setIsFetching(true);
      const starCountRef = ref(db, `${from ? from : "clubslist/"}` + clubId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (type === "edit-my-club") {
          dispatch(clubActions.setCurrentClubInfo(data));
        }
        if (type === "old-info") {
          dispatch(clubActions.setEditOldClubInfo(data));
        }
        setIsFetching(false);
      });
    };

    const fetchCurrentUserNewClub = (clubId, from) => {
      setIsFetching(true);
      const starCountRef = ref(
        db,
        `${from ? from : "clubslist/"}` + clubId + "/" + clubId
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (type === "new-info") {
          dispatch(clubActions.setEditNewClubInfo(data));
        }
        setIsFetching(false);
      });
    };

    if (Cl && type === "edit-my-club") {
      fetchCurrentUserClub(userId);
    }

    if (type === "old-info") {
      fetchCurrentUserClub(editClubId);
    }

    if (type === "new-info") {
      fetchCurrentUserNewClub(editClubId, "req-edit-club-list/");
    }

    addingBgImageAndIcon();

    if (isNewData(editOldClubInfo.clubName, editNewClubInfo.clubName)) {
      setClubNameChanged(true);
    }
    if (isNewData(editOldClubInfo.phoneNumber, editNewClubInfo.phoneNumber)) {
      setClubPhoneNumberChanged(true);
    }
    if (isNewData(editOldClubInfo.categories, editNewClubInfo.categories)) {
      setClubCategoriesChanged(true);
    }
    if (isNewData(editOldClubInfo.description, editNewClubInfo.description)) {
      setClubDescriptionChanged(true);
    }
    if (isNewData(editOldClubInfo.clubBgImage, editNewClubInfo.clubBgImage)) {
      setClubImageChanged(true);
    }
    if (isNewData(editOldClubInfo.clubIcon, editNewClubInfo.clubIcon)) {
      setClubIconChanged(true);
    }
  }, [
    dispatch,
    db,
    imagePreview,
    clubIconPreview,
    selectedCategories,
    userId,
    userType,
    editClubId,
    Cl,
    Ad,
    EditClubReqForAd,
    type,
  ]);

  const isEmptyChecker = (data) => {
    return data.trim().length === 0;
  };

  const formSubmittingHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // to check if the is any input field empty.
    const clubName = isEmptyChecker(formData.clubName);
    const email = isEmptyChecker(formData.email);
    const phoneNumber = isEmptyChecker(formData.phoneNumber);
    const description = isEmptyChecker(formData.description);
    const categories = formData.categories.length === 0;
    const clubBgImage = isEmptyChecker(formData.clubBgImage);
    const clubIcon = isEmptyChecker(formData.clubIcon);
    if (
      clubName ||
      clubName ||
      email ||
      phoneNumber ||
      description ||
      categories ||
      clubBgImage ||
      clubIcon
    ) {
      setIsInfoEmpty(true);
      toast.error("Make sure that you fill all the fields.");
      if (clubBgImage) {
        setIsBgEmpty(true);
      }
      if (clubIcon) {
        setIsIcEmpty(true);
      }
      setIsSubmitting(false);
      return;
    }
    if (Cl && type === "edit-my-club") {
      dispatch(
        clubActions.setReqEditClub({
          info: formData,
          status: {
            clubId: formData.clubId,
            clubIcon: formData.clubIcon,
            clubName: formData.clubName,
            id: formData.clubId,
            reqType: "edit-club",
            status: "pending",
          },
        })
      );
    }

    if (Ad && type === "edit-club-Ad") {
      dispatch(clubActions.addEditedClub(formData));
    }

    if (EditClubReqForAd && submittingName === "approve") {
      dispatch(
        clubActions.setUpdatedClubInfo({
          info: formData,
          status: {
            clubId: formData.clubId,
            clubIcon: formData.clubIcon,
            clubName: formData.clubName,
            id: formData.clubId,
            reqType: "edit-club",
            status: "accepted",
          },
        })
      );
    }

    if (EditClubReqForAd && submittingName === "reject") {
      dispatch(
        clubActions.rejectClubEditingReq({
          clubId: formData.clubId,
          clubIcon: formData.clubIcon,
          clubName: formData.clubName,
          id: formData.clubId,
          reqType: "edit-club",
          status: "rejected",
        })
      );
    }

    if (EditClubReqForAd) {
      console.log("change the tap after submitting");
      navigate("/requests/club-edit-request");
    } else {
      navigate("/clubs-list");
    }
    setIsSubmitting(false);
    setClubNameChanged(false);
    setClubDescriptionChanged(false);
    setClubPhoneNumberChanged(false);
    setClubCategoriesChanged(false);
    setImagePreview(null);
    setClubIconPreview(null);
    setFormData(initialFormData);
  };

  return (
    <main className={`${styles.container} ${className ? className : ""}`}>
      <h1>{title ? title : "Old Club Request"}</h1>
      {isFetching && <BarLoader form={true} />}
      {!isFetching && (
        <form
          onSubmit={type === "old-info" ? () => {} : formSubmittingHandler}
          className={styles["form"]}
        >
          <section
            className={`${styles["images-sec"]} ${
              !selectedFile && isBgEmpty ? styles["input-empty"] : ""
            } ${
              clubImageChanged && type === "new-info"
                ? styles["value-changed"]
                : ""
            }`}
          >
            {Editable && (
              <p className={styles["click-to-change"]}>
                *You can click on the background image and the club icon to
                change them.
              </p>
            )}
            <div className={styles.upBg}>
              {/* Club Background */}
              <input
                type="file"
                id="clubBg"
                name="club-bg"
                className={styles.bgUploadInp}
                onChange={handleFileUpload}
                disabled={isSubmitting || EditClubReqForAd}
              />
              {formData.clubBgImage && (
                <img
                  src={imagePreview || formData.clubBgImage}
                  alt="Preview"
                  className={styles.bgPreview}
                />
              )}
              {!selectedFile && !formData.clubBgImage && (
                <div className={styles.upBg}>
                  <img src={cloud} alt="upload" />
                  <h1>Click to Upload Club Background</h1>
                </div>
              )}
              {/* Club Icon */}
              <div
                className={`${styles.clubImg} ${
                  !selectedClubIcon && isIcEmpty ? styles["input-empty"] : ""
                } ${
                  clubIconChanged && type === "new-info"
                    ? styles["value-changed"]
                    : ""
                }`}
              >
                {!selectedClubIcon && !formData.clubIcon && (
                  <>
                    <img
                      className={styles.clubImgIcon}
                      src={cloud}
                      alt="upload"
                    />
                    <h1>
                      Click to Upload <br /> Club Icon
                    </h1>
                  </>
                )}
                {formData.clubIcon && (
                  <img
                    src={clubIconPreview || formData.clubIcon}
                    alt="Club Icon Preview"
                    className={styles.iconPreview}
                  />
                )}
                <input
                  type="file"
                  id="clubIcon"
                  name="club-icon"
                  className={styles.iconUploadInp}
                  onChange={handleClubIconUpload}
                  disabled={isSubmitting || EditClubReqForAd}
                />
              </div>
            </div>
          </section>
          <div className={styles["inputs"]}>
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-1"]} ${
                isInfoEmpty && isEmptyChecker(formData.clubName)
                  ? styles["input-empty"]
                  : ""
              } ${
                clubNameChanged && type === "new-info"
                  ? styles["value-changed"]
                  : ""
              }`}
              scaleY={1.05}
              input={{
                id: "club-name",
                name: "clubName",
                type: "text",
                placeholder: "Club Name",
                value: formData.clubName,
                onChange: handleInputChange,
                disabled: isSubmitting || EditClubReqForAd,
              }}
            />
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-2"]} ${
                isInfoEmpty && isEmptyChecker(formData.studentId)
                  ? styles["input-empty"]
                  : ""
              } ${Cl ? styles["disabled-input"] : ""}`}
              scaleY={1.05}
              input={{
                id: "student-id",
                name: "studentId",
                type: "text",
                placeholder: "Student ID",
                value: formData.studentId,
                onChange: handleInputChange,
                disabled: isSubmitting || Cl || EditClubReqForAd,
              }}
            />
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-1"]} ${
                isInfoEmpty && isEmptyChecker(formData.managerName)
                  ? styles["input-empty"]
                  : ""
              } ${Cl ? styles["disabled-input"] : ""}`}
              scaleY={1.05}
              input={{
                id: "club-manager-name",
                name: "managerName",
                type: "text",
                placeholder: "Manager Name",
                value: formData.managerName,
                onChange: handleInputChange,
                disabled: isSubmitting || Cl || EditClubReqForAd,
              }}
            />
          </div>
          <div className={styles["inputs2"]}>
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-1"]} ${
                isInfoEmpty && isEmptyChecker(formData.email)
                  ? styles["input-empty"]
                  : ""
              } ${Cl ? styles["disabled-input"] : ""}`}
              scaleY={1.05}
              input={{
                id: "email",
                name: "email",
                type: "text",
                placeholder: "Email Address",
                value: formData.email,
                onChange: handleInputChange,
                disabled: isSubmitting || Cl || EditClubReqForAd,
              }}
            />
            <Input
              className={styles["input-field"]}
              container={`${styles["input-container-2"]} ${
                isInfoEmpty && isEmptyChecker(formData.phoneNumber)
                  ? styles["input-empty"]
                  : ""
              } ${
                clubPhoneNumberChanged && type === "new-info"
                  ? styles["value-changed"]
                  : ""
              }`}
              scaleY={1.05}
              input={{
                id: "phone-number",
                name: "phoneNumber",
                type: "text",
                placeholder: "Contact Number",
                value: formData.phoneNumber,
                onChange: handleInputChange,
                disabled: isSubmitting || EditClubReqForAd,
              }}
            />
            <SelectInput
              isNew={clubCategoriesChanged}
              type={type}
              isEmpty={isInfoEmpty}
              selectedCate={formData.categories}
              disabled={isSubmitting || EditClubReqForAd}
            />
          </div>
          <div className={styles["inputs"]}>
            <textarea
              className={`${
                isInfoEmpty && isEmptyChecker(formData.description)
                  ? styles["input-empty"]
                  : ""
              } ${
                clubDescriptionChanged && type === "new-info"
                  ? styles["value-changed"]
                  : ""
              }`}
              id="club-description"
              name="description"
              rows="6"
              cols="142"
              placeholder="Enter your club description here..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting || EditClubReqForAd}
            />
          </div>
          {children}
        </form>
      )}
    </main>
  );
};

export default ClubEditReq;
