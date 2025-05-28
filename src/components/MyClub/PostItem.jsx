import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { clubActions } from "../../store/club-slice.js";
import { checkAuthClUserType } from "../../util/auth.js";
import { toast } from "sonner";

import DelModal from "./DelModal.jsx";

import styles from "./PostItem.module.css";
import { useTranslation } from "react-i18next";

const PostItem = ({ name, icon, post, canEdit }) => {
  const { t } = useTranslation();

  // Post Deletion Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Editing inputs mode
  const [isEditMode, setIsEditMode] = useState(false);
  // State to store the uploaded image
  const [uploadedImage, setUploadedImage] = useState(null);

  const titleRef = useRef();
  const descRef = useRef();

  const dispatch = useDispatch();

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // Textarea autosize
  function autoGrow(event) {
    const element = event.target;
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  const deletePostHandler = () => {
    dispatch(clubActions.setDeletedPost(post));
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
      timePeriod = `${days} ${t("club-page.post-item.day")}${
        days > 1 ? "s" : ""
      }`;
    } else if (hours > 20) {
      timePeriod = `${hours} ${t("club-page.post-item.hour")}${
        hours > 1 ? "s" : ""
      }`;
    } else if (hours > 0) {
      // Only show hours if greater than 0 and less than or equal to 20
      timePeriod = `${hours} ${t("club-page.post-item.hour")}${
        hours > 1 ? "s" : ""
      }`;
    } else if (minutes > 0) {
      // Include minutes if greater than 0
      timePeriod = `${minutes} ${t("club-page.post-item.minute")}${
        minutes > 1 ? "s" : ""
      }`;
    } else {
      timePeriod = `${seconds} ${t("club-page.post-item.second")}${
        seconds > 1 ? "s" : ""
      }`;
    }

    // Return the formatted time period
    return timePeriod;
  };

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

  const postEditSubmitHandler = (event) => {
    event.preventDefault();

    const newTitle = titleRef.current.value;
    const newDesc = descRef.current.value;

    if (
      newTitle !== post.PostTitle ||
      newDesc !== post.description ||
      uploadedImage !== null
    ) {
      dispatch(
        clubActions.setReqEditPost({
          info: {
            ...post,
            PostTitle: newTitle !== post.PostTitle ? newTitle : post.PostTitle,
            description:
              newDesc !== post.description ? newDesc : post.description,
            PostImage: uploadedImage !== null ? uploadedImage : post.PostImage,
          },
          status: {
            clubId: post.clubId,
            clubName: post.clubName,
            clubIcon: post.clubIcon,
            PostId: post.PostId,
            id: post.PostId,
            reqType: "edit-post",
            status: "pending",
          },
        })
      );
      setIsEditMode((prev) => !prev);
      setUploadedImage(null);
    } else {
      setIsEditMode((prev) => !prev);
      setUploadedImage(null);
      toast.error(t("club-page.post-item.change-info"));
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div>
          <img src={icon} alt="icon" />
          <div>
            <h1>{name}</h1>
            <h2>{getTimePeriod(post.createdDate)}</h2>
          </div>
        </div>
        <div>
          {canEdit && checkAuthClUserType() && (
            <div>
              <button
                type="button"
                onClick={toggleEditMode}
                className={isEditMode ? styles.editModeBtn : null}
              >
                {isEditMode
                  ? `${t("club-page.post-item.editing")}`
                  : `${t("club-page.post-item.edit-post")}`}
              </button>
              <button type="button" onClick={() => setIsModalOpen(true)}>
                {t("club-page.post-item.delete-post")}
              </button>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={postEditSubmitHandler}>
        {isEditMode ? (
          <input
            ref={titleRef}
            type="text"
            name="postTitle"
            defaultValue={post.PostTitle}
          />
        ) : (
          <p>{post.PostTitle}</p>
        )}
        {isEditMode ? (
          <textarea
            ref={descRef}
            name="postDesc"
            defaultValue={post.description}
            onChange={autoGrow}
            onMouseEnter={autoGrow}
          />
        ) : (
          <p>{post.description}</p>
        )}
        {isEditMode ? (
          <div className={styles.images}>
            <img
              src={uploadedImage || post.PostImage}
              alt="post image"
              className={styles.preview}
            />
            <label htmlFor="file-upload" className={styles.imgUpload}>
              {t("club-page.post-item.edit")}
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
            src={post.PostImage}
            alt="post image"
            className={styles.preview}
          />
        )}
        {isEditMode && (
          <div className={styles.editBtns}>
            <button type="button" onClick={toggleEditMode}>
              {t("club-page.post-item.cancel")}
            </button>
            <button type="submit">{t("club-page.post-item.apply")}</button>
          </div>
        )}
      </form>
      <DelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={icon}
        title={`${name} ?`}
        onConfirmDelete={deletePostHandler}
      />
    </div>
  );
};

export default PostItem;
