// src/components/Clubs/CreateClub.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "sonner";

import Input from "../UI/Input";
import ColoreButton from "../UI/ColoredButton";
import SelectInput from "../EventsList/SelectInput";

import { secondaryAuth } from "../../firebase";
import { clubActions } from "../../store/club-slice";

import cloud from "../../assets/icons/CreateClub/cloud_upload.png";
import styles from "./CreateClub.module.css";

const CreateClub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCategories = useSelector(
    (state) => state.club.selectedCategories
  );

  const initialFormData = {
    clubId: "",
    clubName: "",
    studentId: "",
    managerName: "",
    email: "",
    phoneNumber: "",
    description: "",
    categories: [],
    clubBgImage: "",
    clubIcon: "",
    createdDate: "",
    events: [],
    posts: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [clubIconPreview, setClubIconPreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoEmpty, setIsInfoEmpty] = useState(false);
  const [isBgEmpty, setIsBgEmpty] = useState(false);
  const [isIcEmpty, setIsIcEmpty] = useState(false);

  // keep formData in sync with previews + categories + timestamp
  useEffect(() => {
    if (imagePreview && clubIconPreview) {
      setFormData((prev) => ({
        ...prev,
        categories: selectedCategories,
        clubBgImage: imagePreview,
        clubIcon: clubIconPreview,
        createdDate: new Date().toISOString(),
      }));
    }
  }, [imagePreview, clubIconPreview, selectedCategories]);

  const isEmpty = (val) => !val.trim().length;
  const checks = {
    clubName: isEmpty(formData.clubName),
    studentId: isEmpty(formData.studentId),
    managerName: isEmpty(formData.managerName),
    email: isEmpty(formData.email),
    phoneNumber: isEmpty(formData.phoneNumber),
    description: isEmpty(formData.description),
    categories: formData.categories.length === 0,
    clubBgImage: isEmpty(formData.clubBgImage),
    clubIcon: isEmpty(formData.clubIcon),
  };

  const passwordCreator = (name, id) =>
    name.trim().charAt(0).toUpperCase() + id;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setIsBgEmpty(false);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClubIconUpload = (e) => {
    const file = e.target.files[0];
    setIsIcEmpty(false);
    const reader = new FileReader();
    reader.onload = () => setClubIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    setIsInfoEmpty(false);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmittingHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // validation
    if (Object.values(checks).some(Boolean)) {
      setIsInfoEmpty(true);
      if (checks.clubBgImage) setIsBgEmpty(true);
      if (checks.clubIcon) setIsIcEmpty(true);
      toast.error("Please review all fields and fill in the missing info.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1) create manager on secondaryAuth
      const password = passwordCreator(
        formData.managerName,
        formData.studentId
      );
      const { user } = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        password
      );
      const managerId = user.uid;

      // 2) immediately sign out secondaryAuth
      await signOut(secondaryAuth);

      // 3) dispatch bundled club + managerId
      dispatch(
        clubActions.addNewClub({
          clubData: formData,
          managerId,
        })
      );

      // 4) navigate away
      navigate("/clubs-list");
    } catch (err) {
      toast.error(err.message || "Error creating club manager");
    } finally {
      setIsSubmitting(false);
      setImagePreview(null);
      setClubIconPreview(null);
      setFormData(initialFormData);
      setIsBgEmpty(false);
      setIsIcEmpty(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Create Club</h1>
      <form onSubmit={formSubmittingHandler} className={styles.form}>
        <section
          className={`${styles["images-sec"]} ${
            !imagePreview && isBgEmpty ? styles["input-empty"] : ""
          }`}
        >
          <div className={styles.upBg}>
            <input
              type="file"
              id="clubBg"
              name="clubBg"
              className={styles.bgUploadInp}
              onChange={handleFileUpload}
              disabled={isSubmitting}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.bgPreview}
              />
            ) : (
              <div className={styles.upBgPlaceholder}>
                <img src={cloud} alt="upload" />
                <h1>Click to Upload Club Background</h1>
              </div>
            )}
          </div>

          <div
            className={`${styles.clubImg} ${
              !clubIconPreview && isIcEmpty ? styles["input-empty"] : ""
            }`}
          >
            <input
              type="file"
              id="clubIcon"
              name="clubIcon"
              className={styles.iconUploadInp}
              onChange={handleClubIconUpload}
              disabled={isSubmitting}
            />
            {clubIconPreview ? (
              <img
                src={clubIconPreview}
                alt="Club Icon Preview"
                className={styles.iconPreview}
              />
            ) : (
              <div className={styles.iconPlaceholder}>
                <img src={cloud} alt="upload" />
                <h1>
                  Click to Upload <br /> Club Icon
                </h1>
              </div>
            )}
          </div>
        </section>

        <div className={styles.inputs}>
          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-1"]} ${
              isInfoEmpty && checks.clubName ? styles["input-empty"] : ""
            }`}
            scaleY={1.05}
            input={{
              id: "club-name",
              name: "clubName",
              type: "text",
              placeholder: "Club Name",
              value: formData.clubName,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
          />

          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-2"]} ${
              isInfoEmpty && checks.studentId ? styles["input-empty"] : ""
            }`}
            scaleY={1.05}
            input={{
              id: "student-id",
              name: "studentId",
              type: "text",
              placeholder: "Student ID",
              value: formData.studentId,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
          />

          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-1"]} ${
              isInfoEmpty && checks.managerName ? styles["input-empty"] : ""
            }`}
            scaleY={1.05}
            input={{
              id: "manager-name",
              name: "managerName",
              type: "text",
              placeholder: "Manager Name",
              value: formData.managerName,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
          />
        </div>

        <div className={styles["inputs2"]}>
          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-1"]} ${
              isInfoEmpty && checks.email ? styles["input-empty"] : ""
            }`}
            scaleY={1.05}
            input={{
              id: "email",
              name: "email",
              type: "text",
              placeholder: "Email Address",
              value: formData.email,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
          />

          <Input
            className={styles["input-field"]}
            container={`${styles["input-container-2"]} ${
              isInfoEmpty && checks.phoneNumber ? styles["input-empty"] : ""
            }`}
            scaleY={1.05}
            input={{
              id: "phone-number",
              name: "phoneNumber",
              type: "text",
              placeholder: "Contact Number",
              value: formData.phoneNumber,
              onChange: handleInputChange,
              disabled: isSubmitting,
            }}
          />

          <SelectInput
            isEmpty={isInfoEmpty && checks.categories}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.inputs}>
          <textarea
            className={
              isInfoEmpty && checks.description ? styles["input-empty"] : ""
            }
            id="club-description"
            name="description"
            rows="6"
            cols="142"
            placeholder="Enter your club description here..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.actions}>
          <ColoreButton red disabled={isSubmitting}>
            Cancel
          </ColoreButton>
          <ColoreButton type="submit" disabled={isSubmitting}>
            Create
          </ColoreButton>
        </div>
      </form>
    </main>
  );
};

export default CreateClub;
