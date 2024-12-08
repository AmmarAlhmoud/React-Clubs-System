import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { clubActions } from "../../store/club-slice";

import CloseBtn from "../UI/CloseBtn";
import Image from "../UI/Image";

import styles from "./PostEditRequestDetails.module.css";
import BarLoader from "../UI/BarLoader";

let initialLoad = true;

const PostEditRequestDetails = () => {
  const dispatch = useDispatch();
  const postEditDetails = useSelector(
    (state) => state.club.currentEditPostDetails
  );
  const currentPost = useSelector((state) => state.club.currentPost);
  const [isFetching, setIsFetching] = useState(false);
  const db = database;

  const { id, clubId, PostName, PostImage, description } = postEditDetails;

  const [isPostDescNew, setIsPostDescNew] = useState(false);
  const [isPostImageNew, setIsPostImageNew] = useState(false);

  const isNewData = (oldInfo, newInfo) => {
    return oldInfo?.trim() !== newInfo?.trim();
  };

  useEffect(() => {
    const fetchCurrentPost = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "posts-list/" + clubId + "/" + id);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setCurrentPost(data));
        setIsFetching(false);
      });
    };

    setIsPostDescNew(false);
    setIsPostImageNew(false);
    fetchCurrentPost();
    if (initialLoad) {
      initialLoad = false;
    }

    if (initialLoad === false) {
      if (isNewData(description, currentPost?.description)) {
        setIsPostDescNew(true);
      }

      if (isNewData(PostImage, currentPost?.PostImage)) {
        setIsPostImageNew(true);
      }
    }
  }, [
    PostImage,
    PostName,
    clubId,
    currentPost?.PostImage,
    currentPost?.description,
    db,
    description,
    dispatch,
    id,
  ]);

  const closeDetailsHandler = () => {
    // close the event details
    dispatch(clubActions.setCurrentEditPostDetails(null));
    dispatch(clubActions.setShowEditPostDetails(false));
  };

  return (
    <>
      {isFetching && (
        <section className={styles["post-details-load"]}>
          <BarLoader postEdit={true} />
        </section>
      )}
      {!isFetching && (
        <section className={styles["post-details"]}>
          <CloseBtn onClick={closeDetailsHandler} />
          <section className={styles.sec1}>
            <h2 className={styles.h2}>Original Request</h2>
            <div className={styles["post-image"]}>
              <Image src={currentPost?.PostImage} alt="post Original Image" />
            </div>
          </section>
          <section className={styles.sec2}>
            <div>
              <h2 className={styles.h2}>Description</h2>
              <p className={styles["post-desc"]}>{currentPost?.description}</p>
            </div>
          </section>
          <div className={styles.border} />

          <section className={styles.sec3}>
            <h2 className={styles.h2}>New Request</h2>
            <div
              className={`${styles["post-image"]} ${
                isPostImageNew ? styles.newDataImg : ""
              }`}
            >
              <Image src={PostImage} alt="post New Image" />
            </div>
          </section>
          <section className={styles.sec4}>
            <div>
              <h2 className={styles.h2}>Description</h2>
              <p
                className={`${styles["post-desc"]} ${
                  isPostDescNew ? styles.newDataDesc : ""
                }`}
              >
                {description}
              </p>
            </div>
          </section>
        </section>
      )}
    </>
  );
};

export default PostEditRequestDetails;
