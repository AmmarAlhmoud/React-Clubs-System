import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clubActions } from "../../store/club-slice";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "sonner";

import Input from "../UI/Input";
import ColoreButton from "../UI/ColoredButton";

import cloud from "../../assets/icons/CreateClub/cloud_upload.png";
import styles from "./CreateClub.module.css";
import SelectInput from "../EventsList/SelectInput";

const CreateClub = () => {
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

  const { signup } = useAuth();
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
  // Managing icons to upload ------ end

  // handle club creation ------ start
  const selectedCategories = useSelector(
    (state) => state.club.selectedCategories
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoEmpty, setIsInfoEmpty] = useState(false);
  const [isBgEmpty, setIsBgEmpty] = useState(false);
  const [isIcEmpty, setIsIcEmpty] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const addingBgImageAndIcon = async () => {
      if (imagePreview && clubIconPreview) {
        try {
          setFormData((prevFormData) => ({
            ...prevFormData,
            categories: selectedCategories,
            clubBgImage: imagePreview,
            clubIcon: clubIconPreview,
            createdDate: new Date().toLocaleDateString(),
          }));
        } catch (error) {
          toast.error("Error uploading the images please try again");
        }
      }
    };

    addingBgImageAndIcon();
  }, [imagePreview, clubIconPreview, selectedCategories]);

  const isEmptyChecker = (data) => {
    return data.trim().length === 0;
  };

  const passwordCreator = (managerName, studentId) => {
    const managerInitial = managerName.trim().substring(0, 1).toUpperCase();
    const composedPass = managerInitial + studentId;
    return composedPass;
  };

  const formSubmittingHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // to check if the is any input field empty.
    const studentId = isEmptyChecker(formData.studentId);
    const clubName = isEmptyChecker(formData.clubName);
    const managerName = isEmptyChecker(formData.managerName);
    const email = isEmptyChecker(formData.email);
    const phoneNumber = isEmptyChecker(formData.phoneNumber);
    const description = isEmptyChecker(formData.description);
    const categories = formData.categories.length === 0;
    const clubBgImage = isEmptyChecker(formData.clubBgImage);
    const clubIcon = isEmptyChecker(formData.clubIcon);
    if (
      studentId ||
      clubName ||
      clubName ||
      managerName ||
      email ||
      phoneNumber ||
      description ||
      categories ||
      clubBgImage ||
      clubIcon
    ) {
      setIsInfoEmpty(true);
      if (clubBgImage) {
        setIsBgEmpty(true);
      }
      if (clubIcon) {
        setIsIcEmpty(true);
      }
      setIsSubmitting(false);
      toast.error(
        "Please review the information and ensure all fields are filled"
      );

      return;
    }
    // to register new club manager when creating the club.
    signup(
      formData.email,
      passwordCreator(formData.managerName, formData.studentId)
    );
    dispatch(clubActions.addNewClub(formData));
    navigate("/clubs-list");
    setIsSubmitting(false);
    setImagePreview(null);
    setClubIconPreview(null);
    setFormData(initialFormData);
  };

  return (
    <main className={styles.container}>
      <h1>Create Club</h1>
      <form onSubmit={formSubmittingHandler} className={styles["form"]}>
        <section
          className={`${styles["images-sec"]} ${
            !selectedFile && isBgEmpty ? styles["input-empty"] : ""
          }`}
        >
          <div className={styles.upBg}>
            {/* Club Background */}
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
                <h1>Click to Upload Club Background</h1>
              </div>
            )}
            {/* Club Icon */}
            <div
              className={`${styles.clubImg} ${
                !selectedClubIcon && isIcEmpty ? styles["input-empty"] : ""
              }`}
            >
              {!selectedClubIcon && (
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
              {clubIconPreview && (
                <img
                  src={clubIconPreview}
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
                disabled={isSubmitting}
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
              isInfoEmpty && isEmptyChecker(formData.studentId)
                ? styles["input-empty"]
                : ""
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
              isInfoEmpty && isEmptyChecker(formData.managerName)
                ? styles["input-empty"]
                : ""
            }`}
            scaleY={1.05}
            input={{
              id: "club-manager-name",
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
              isInfoEmpty && isEmptyChecker(formData.email)
                ? styles["input-empty"]
                : ""
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
              isInfoEmpty && isEmptyChecker(formData.phoneNumber)
                ? styles["input-empty"]
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
              disabled: isSubmitting,
            }}
          />
          <SelectInput isEmpty={isInfoEmpty} disabled={isSubmitting} />
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
            rows="6"
            cols="142"
            placeholder="Enter your club description here..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.actions}>
          <ColoreButton red={true}>Cancel</ColoreButton>
          <ColoreButton type="submit" disabled={isSubmitting}>
            Create
          </ColoreButton>
        </div>
      </form>
    </main>
  );
};

export default CreateClub;
