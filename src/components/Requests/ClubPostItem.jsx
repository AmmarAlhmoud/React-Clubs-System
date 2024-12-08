import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { clubActions } from "../../store/club-slice";
import { eventsActions } from "../../store/events-slice";
import ColoredButton from "../UI/ColoredButton";

import styles from "./ClubPostItem.module.css";

let initialLoad = true;

const ClubPostItem = ({
  id,
  clubId,
  CName,
  CMName,
  PostName,
  CLogo,
  CMLogo,
  PostImage,
  description,
  PostStatus,
  requestPost,
  type,
}) => {
  const dispatch = useDispatch();
  const db = database;
  const showDetails = useSelector((state) => state.events.showPostDetails);
  const reqPostStatus = useSelector((state) => state.events.reqPostStatus);

  const reqEditPostStatus = useSelector(
    (state) => state.club.reqEditPostStatus
  );
  const showEditDetails = useSelector(
    (state) => state.club.showEditPostDetails
  );

  useEffect(() => {
    const fetchCurrentPostStatus = () => {
      const starCountRef = ref(
        db,
        "req-status-list/post-request/" + clubId + "/" + id
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(eventsActions.setReqPostStatus(data));
      });
    };

    const fetchCurrentEditPostStatus = () => {
      const starCountRef = ref(
        db,
        "req-status-list/post-edit-request/" + clubId + "/" + id
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        dispatch(clubActions.setReqEditPostStatus(data));
      });
    };

    if (initialLoad || id !== null) {
      fetchCurrentPostStatus();
      fetchCurrentEditPostStatus();
      initialLoad = false;
    }
  }, [clubId, db, dispatch, id, showEditDetails]);

  const acceptPostReqHandler = () => {
    if (
      requestPost !== null &&
      reqPostStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        eventsActions.setReqPostData({
          info: requestPost,
          status: {
            ...reqPostStatus,
            status: "accepted",
          },
        })
      );
    }
  };

  const rejectPostReqHandler = () => {
    if (
      requestPost !== null &&
      reqPostStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        eventsActions.setRejectPostStatus({
          ...reqPostStatus,
          status: "rejected",
        })
      );
    }
  };

  const showDetailsHandler = () => {
    dispatch(
      eventsActions.setCurrentPostDetails({
        id,
        CName,
        CMName,
        PostName,
        CLogo,
        CMLogo,
        PostImage,
        description,
        PostStatus,
      })
    );
    dispatch(eventsActions.setShowPostDetails({ show: true, id }));
  };

  const acceptEditPostReqHandler = () => {
    if (
      requestPost !== null &&
      reqEditPostStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        clubActions.setReqEditPostData({
          info: requestPost,
          status: {
            ...reqEditPostStatus,
            status: "accepted",
          },
        })
      );
    }
  };

  const rejectEditPostReqHandler = () => {
    if (
      requestPost !== null &&
      reqEditPostStatus !== null &&
      initialLoad === false
    ) {
      dispatch(
        clubActions.setRejectEditPostStatus({
          ...reqEditPostStatus,
          status: "rejected",
        })
      );
    }
  };

  const showEditDetailsHandler = () => {
    dispatch(
      clubActions.setCurrentEditPostDetails({
        id,
        clubId,
        PostName,
        PostImage,
        description,
      })
    );
    dispatch(clubActions.setShowEditPostDetails({ show: true, id }));
  };

  return (
    <li
      id={id}
      className={`${styles.container} ${!PostName ? styles["no-detials"] : ""}`}
    >
      <section className={styles["club-info"]}>
        <div className={styles["logo-name-conatiner"]}>
          <img src={CLogo} alt={CName + " Logo"} />
          <p>{CName}</p>
        </div>
        <div className={styles["logo-name-conatiner"]}>
          <img src={CMLogo} alt={CMName + " Logo"} />
          <p>{CMName}</p>
        </div>
      </section>
      {PostName && (
        <ul className={styles["post-info"]}>
          <li className={styles.sec1}>
            <span>
              <p className={styles["post-tag"]}>Post Name</p>
              <p className={styles["post-tag-content"]}>{PostName}</p>
            </span>
          </li>
        </ul>
      )}
      {type !== "edit-post" && (
        <div className={styles.actions}>
          <ColoredButton onClick={acceptPostReqHandler}>Accept</ColoredButton>
          <ColoredButton red={true} onClick={rejectPostReqHandler}>
            Reject
          </ColoredButton>
        </div>
      )}
      {type === "edit-post" && (
        <div className={styles.actions}>
          <ColoredButton onClick={acceptEditPostReqHandler}>
            Accept
          </ColoredButton>
          <ColoredButton red={true} onClick={rejectEditPostReqHandler}>
            Reject
          </ColoredButton>
        </div>
      )}
      {type !== "edit-post" && (
        <div
          className={`${styles["action-details"]} ${
            showDetails.show && id === showDetails.id ? styles.active : ""
          }`}
        >
          <ColoredButton purble={true} onClick={showDetailsHandler}>
            Details
          </ColoredButton>
        </div>
      )}
      {type === "edit-post" && (
        <div
          className={`${styles["action-details"]} ${
            showEditDetails.show && id === showEditDetails.id
              ? styles.active
              : ""
          }`}
        >
          <ColoredButton purble={true} onClick={showEditDetailsHandler}>
            Details
          </ColoredButton>
        </div>
      )}
    </li>
  );
};

export default ClubPostItem;
