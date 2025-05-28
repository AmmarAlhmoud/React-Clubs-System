import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "./../../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { clubActions } from "../../store/club-slice";
import { toast } from "sonner";
import C_Logo from "../../assets/icons/EventsList/med_logo.png";
import CM_Logo from "../../assets/icons/EventsList/club_manager_logo.png";

import ClubPostItem from "./ClubPostItem";
import PostEditRequestDetails from "./PostEditRequestDetails";
import DetailsHidden from "./DetailsHidden";
import BarLoader from "../UI/BarLoader";

import styles from "./PostEditRequest.module.css";
import { useTranslation } from "react-i18next";

let initialLoad = true;

const PostEditRequest = () => {
  const { t } = useTranslation();

  const reqEditPostsList = useSelector((state) => state.club.reqEditPostsList);
  const showDetails = useSelector((state) => state.club.showEditPostDetails);
  const reqEditPostData = useSelector((state) => state.club.reqEditPostData);
  const rejectEditPostStatus = useSelector(
    (state) => state.club.rejectEditPostStatus
  );
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const db = database;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-edit-posts-list");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setReqEditPostsList(data));
        setIsFetching(false);
      });
    };

    const addEditedPostToClub = (editedPostToClub) => {
      const updates1 = {};
      const updates2 = {};
      updates1[
        "clubslist/" +
          editedPostToClub.clubId +
          "/posts/" +
          editedPostToClub.PostId
      ] = { ...editedPostToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates1);
      // second add
      updates2[
        "/posts-list/" + editedPostToClub.clubId + "/" + editedPostToClub.PostId
      ] = { ...editedPostToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates2)
        .then(() => {
          toast.success(
            `"${editedPostToClub.PostTitle}" ${t(
              "requests.post-edit-req.accept-post-req"
            )}`
          );
        })
        .catch(() => {
          toast.error(t("requests.post-edit-req.error-accept-post-req"));
        });
    };

    const removeEditPostReq = (deletedPost) => {
      const starCountRef = ref(
        db,
        "req-edit-posts-list/" + deletedPost.clubId + "/" + deletedPost.PostId
      );
      remove(starCountRef);
    };

    const editPostEditReqStatus = (editedStatus) => {
      const updates = {};
      updates[
        "req-status-list/post-edit-request/" +
          editedStatus.clubId +
          "/" +
          editedStatus.PostId
      ] = editedStatus;
      update(ref(db), updates);
    };

    if (initialLoad) {
      // fetch the current edit posts list requests at startup
      fetchCurrentUserClub();
      initialLoad = false;
    }

    // handle the acception of the post request
    if (
      initialLoad === false &&
      reqEditPostData !== null &&
      reqEditPostsList !== null
    ) {
      addEditedPostToClub(reqEditPostData.info);
      editPostEditReqStatus(reqEditPostData.status);
      removeEditPostReq(reqEditPostData.info);
      dispatch(clubActions.setShowEditPostDetails(false));
      dispatch(clubActions.setReqEditPostData(null));
    }

    // handle the rejection of post request

    if (
      initialLoad === false &&
      rejectEditPostStatus !== null &&
      reqEditPostsList !== null
    ) {
      console.log(rejectEditPostStatus);
      editPostEditReqStatus(rejectEditPostStatus);
      removeEditPostReq(rejectEditPostStatus);
      dispatch(clubActions.setShowEditPostDetails(false));
      dispatch(clubActions.setRejectEditPostStatus(null));
      toast.success(t("requests.post-edit-req.reject-post-req"));
    }
  }, [dispatch, db, reqEditPostsList, reqEditPostData, rejectEditPostStatus]);

  let editPostsList = null;

  if (reqEditPostsList === null && isFetching === true) {
    editPostsList = <BarLoader requests={true} />;
  }

  if (reqEditPostsList !== null) {
    editPostsList = Object.values(reqEditPostsList).map((club) => {
      return Object.values(club).map((reqEditPost) => {
        return (
          <ClubPostItem
            key={reqEditPost.PostId}
            id={reqEditPost.PostId}
            clubId={reqEditPost.clubId}
            CName={reqEditPost.clubName}
            CMName={reqEditPost.clubManager}
            CLogo={reqEditPost.clubIcon}
            PostName={reqEditPost.PostTitle}
            CMLogo={CM_Logo}
            PostImage={reqEditPost.PostImage}
            PostStatus={reqEditPost.PostStatus}
            description={reqEditPost.description}
            requestPost={reqEditPost}
            type="edit-post"
          />
        );
      });
    });
  }

  if (
    (reqEditPostsList === null || typeof reqEditPostsList === "string") &&
    isFetching === false
  ) {
    editPostsList = (
      <p className={styles["no-req-edit-post-item"]}>
        {t("requests.post-edit-req.no-post")}
      </p>
    );
  }

  return (
    <section className={styles["club-post"]}>
      <ul className={styles["club-post-list"]}>{editPostsList}</ul>
      {reqEditPostsList !== null && !showDetails && (
        <DetailsHidden DName={t("requests.post-edit-req.post")} />
      )}
      {showDetails && <PostEditRequestDetails />}
    </section>
  );
};

export default PostEditRequest;
