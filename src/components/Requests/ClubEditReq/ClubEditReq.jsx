import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase";
import { getAuthUserId, getAuthUserType } from "../../../util/auth";
import { clubActions } from "../../../store/club-slice";
import { toast } from "sonner";

import cloud from "../../../assets/icons/CreateClub/cloud_upload.png";
import Input from "../../UI/Input";
import SelectInput from "../../EventsList/SelectInput";
import BarLoader from "../../UI/BarLoader";

import styles from "./ClubEditReq.module.css";

const ClubEditReq = ({ title, className, type, Editable, children }) => {
  // Auth and role
  const userId = getAuthUserId();
  const userType = getAuthUserType();
  const Cl = userType === "Cl";
  const Ad = userType === "Ad";
  const EditClubReqForAd =
    Ad && window.location.pathname.startsWith("/requests/");

  // Navigation & Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editClubId } = useParams();

  // Redux slices
  const currentClub = useSelector((state) => state.club.currentClubInfo);
  const editOldClubInfo = useSelector((state) => state.club.editOldClubInfo);
  const editNewClubInfo = useSelector((state) => state.club.editNewClubInfo);
  const submittingName = useSelector((state) => state.club.submittingName);
  const selectedCategories = useSelector(
    (state) => state.club.selectedCategories
  );

  // Local state
  const [formData, setFormData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoEmpty, setIsInfoEmpty] = useState(false);
  const [isBgEmpty, setIsBgEmpty] = useState(false);
  const [isIcEmpty, setIsIcEmpty] = useState(false);

  // Preview states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedClubIcon, setSelectedClubIcon] = useState(null);
  const [clubIconPreview, setClubIconPreview] = useState(null);

  // Change-tracking flags
  const [clubNameChanged, setClubNameChanged] = useState(false);
  const [clubPhoneNumberChanged, setClubPhoneNumberChanged] = useState(false);
  const [clubDescriptionChanged, setClubDescriptionChanged] = useState(false);
  const [clubCategoriesChanged, setClubCategoriesChanged] = useState(false);
  const [clubImageChanged, setClubImageChanged] = useState(false);
  const [clubIconChanged, setClubIconChanged] = useState(false);

  // Utility to compare old vs new
  const isNewData = (oldInfo, newInfo) => {
    if (typeof oldInfo === "string") {
      return oldInfo?.trim() !== newInfo?.trim();
    }
    return Array.isArray(oldInfo)
      ? oldInfo.length !== newInfo.length
      : oldInfo !== newInfo;
  };

  // Determine which data slice to use
  let clubData = null;
  if (Cl && type === "edit-my-club") clubData = currentClub;
  if (Ad && type === "edit-club-Ad") clubData = currentClub;
  if (type === "old-info") clubData = editOldClubInfo;
  if (type === "new-info") clubData = editNewClubInfo;

  // 1) Fetch from Firebase into Redux
  useEffect(() => {
    const fetchCurrentUserClub = (clubId, path = "clubslist/") => {
      setIsFetching(true);
      const starCountRef = ref(database, `${path}${clubId}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (Cl && type === "edit-my-club")
          dispatch(clubActions.setCurrentClubInfo(data));
        if (Ad && type === "edit-club-Ad")
          dispatch(clubActions.setCurrentClubInfo(data));
        if (type === "old-info") dispatch(clubActions.setEditOldClubInfo(data));
        setIsFetching(false);
      });
    };

    const fetchCurrentUserNewClub = (clubId) => {
      setIsFetching(true);
      const starCountRef = ref(
        database,
        `req-edit-club-list/${clubId}/${clubId}`
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (type === "new-info") dispatch(clubActions.setEditNewClubInfo(data));
        setIsFetching(false);
      });
    };

    if (Cl && type === "edit-my-club") fetchCurrentUserClub(userId);
    if (Ad && type === "edit-club-Ad") fetchCurrentUserClub(editClubId);
    if (type === "old-info") fetchCurrentUserClub(editClubId);
    if (type === "new-info") fetchCurrentUserNewClub(editClubId);
  }, [dispatch, userId, editClubId, Cl, Ad, type]);

  // 2) Sync Redux -> Local formData when clubData arrives
  useEffect(() => {
    if (!clubData) return;

    setFormData({
      clubId: clubData.clubId || "",
      clubName: clubData.clubName || "",
      studentId: clubData.studentId || "",
      managerName: clubData.managerName || "",
      email: clubData.email || "",
      phoneNumber: clubData.phoneNumber || "",
      description: clubData.description || "",
      categories: clubData.categories || [],
      clubBgImage: clubData.clubBgImage || "",
      createdData: clubData.createdData || new Date().toISOString(),
      clubIcon: clubData.clubIcon || "",
      events: clubData.events || {},
      posts: clubData.posts || {},
    });

    // Reset change flags
    setClubNameChanged(false);
    setClubPhoneNumberChanged(false);
    setClubDescriptionChanged(false);
    setClubCategoriesChanged(false);
    setClubImageChanged(false);
    setClubIconChanged(false);
  }, [clubData]);

  // 3) Merge previews & category picks into formData
  useEffect(() => {
    if (!formData) return;
    if (imagePreview) {
      setFormData((prev) => ({ ...prev, clubBgImage: imagePreview }));
      setClubImageChanged(true);
    }
    if (clubIconPreview) {
      setFormData((prev) => ({ ...prev, clubIcon: clubIconPreview }));
      setClubIconChanged(true);
    }
    if (selectedCategories.length) {
      setFormData((prev) => ({ ...prev, categories: selectedCategories }));
      setClubCategoriesChanged(true);
    }
  }, [imagePreview, clubIconPreview, selectedCategories]);

  // 4) Highlight differences for edit requests (new-info)
  useEffect(() => {
    if (type !== "new-info" || !formData) return;
    setClubNameChanged(isNewData(editOldClubInfo.clubName, formData.clubName));
    setClubPhoneNumberChanged(
      isNewData(editOldClubInfo.phoneNumber, formData.phoneNumber)
    );
    setClubDescriptionChanged(
      isNewData(editOldClubInfo.description, formData.description)
    );
    setClubCategoriesChanged(
      isNewData(editOldClubInfo.categories, formData.categories)
    );
    setClubImageChanged(
      isNewData(editOldClubInfo.clubBgImage, formData.clubBgImage)
    );
    setClubIconChanged(isNewData(editOldClubInfo.clubIcon, formData.clubIcon));
  }, [editOldClubInfo, formData, type]);

  // File upload handlers
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClubIconUpload = (e) => {
    const file = e.target.files[0];
    setSelectedClubIcon(file);
    const reader = new FileReader();
    reader.onload = () => setClubIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Empty check
  const isEmpty = (str) => !str || !str.trim().length;

  // Submit handler
  const formSubmittingHandler = async (e) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);

    // Validation
    const checks = [
      isEmpty(formData.clubName),
      isEmpty(formData.email),
      isEmpty(formData.phoneNumber),
      isEmpty(formData.description),
      formData.categories.length === 0,
      isEmpty(formData.clubBgImage),
      isEmpty(formData.clubIcon),
    ];
    if (checks.some(Boolean)) {
      setIsInfoEmpty(true);
      toast.error("Make sure that you fill all the fields.");
      setIsBgEmpty(isEmpty(formData.clubBgImage));
      setIsIcEmpty(isEmpty(formData.clubIcon));
      setIsSubmitting(false);
      return;
    }

    // Dispatch according to role/type
    if (Cl && type === "edit-my-club") {
      dispatch(
        clubActions.setReqEditClub({
          info: formData,
          status: {
            clubId: formData.clubId,
            clubName: formData.clubName,
            clubIcon: formData.clubIcon,
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
            clubName: formData.clubName,
            clubIcon: formData.clubIcon,
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
          clubName: formData.clubName,
          clubIcon: formData.clubIcon,
          id: formData.clubId,
          reqType: "edit-club",
          status: "rejected",
        })
      );
    }

    // Navigate after submit
    if (EditClubReqForAd) {
      navigate("/requests/club-edit-request");
    } else {
      navigate("/clubs-list");
    }

    // Reset form state
    setIsSubmitting(false);
    setIsInfoEmpty(false);
    setIsBgEmpty(false);
    setIsIcEmpty(false);
    setImagePreview(null);
    setClubIconPreview(null);
    setFormData(null);
  };

  // Render guard
  if (isFetching || formData === null) {
    return <BarLoader form={true} />;
  }

  return (
    <main className={`${styles.container} ${className || ""}`}>
      <h1>
        {title || (type === "old-info" ? "Old Club Request" : "Edit Club")}
      </h1>
      <form
        onSubmit={type === "old-info" ? () => {} : formSubmittingHandler}
        className={styles.form}
      >
        {/* Images Section */}
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
              *You can click on the background image and the club icon to change
              them.
            </p>
          )}
          <div className={styles.upBg}>
            <input
              type="file"
              id="clubBg"
              name="clubBg"
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
                name="clubIcon"
                className={styles.iconUploadInp}
                onChange={handleClubIconUpload}
                disabled={isSubmitting || EditClubReqForAd}
              />
            </div>
          </div>
        </section>

        {/* Text Inputs */}
        <div className={styles.inputs}>
          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-1"]} ${
              isInfoEmpty && isEmpty(formData.clubName)
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
              isInfoEmpty && isEmpty(formData.studentId)
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
              isInfoEmpty && isEmpty(formData.managerName)
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

        <div className={styles.inputs2}>
          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-1"]} ${
              isInfoEmpty && isEmpty(formData.email)
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
              isInfoEmpty && isEmpty(formData.phoneNumber)
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

        <div className={styles.inputs}>
          <textarea
            className={`${
              isInfoEmpty && isEmpty(formData.description)
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
    </main>
  );
};

export default ClubEditReq;
