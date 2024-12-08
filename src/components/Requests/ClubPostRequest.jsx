import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { eventsActions } from "../../store/events-slice";
import { toast } from "sonner";

import CM_Logo from "../../assets/icons/EventsList/club_manager_logo.png";

import ClubPostItem from "./ClubPostItem";
import ClubPostRequestDetails from "./ClubPostRequestDetails";
import DetailsHidden from "./DetailsHidden";
import BarLoader from "../UI/BarLoader";

import styles from "./ClubPostRequest.module.css";

let initialLoad = true;

const ClubPostRequest = () => {
  const reqPostsList = useSelector((state) => state.events.reqPostsList);
  const showDetails = useSelector((state) => state.events.showPostDetails);
  const reqPostData = useSelector((state) => state.events.reqPostData);
  const rejectPostStatus = useSelector(
    (state) => state.events.rejectPostStatus
  );
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const db = database;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-posts-list");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        dispatch(eventsActions.setReqPostsList(data));
        setIsFetching(false);
      });
    };

    const addNewPostToClub = (newPostToClub) => {
      const updates1 = {};
      const updates2 = {};
      updates1[
        "clubslist/" + newPostToClub.clubId + "/posts/" + newPostToClub.PostId
      ] = { ...newPostToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates1);
      // second add
      updates2[
        "/posts-list/" + newPostToClub.clubId + "/" + newPostToClub.PostId
      ] = { ...newPostToClub, createdDate: new Date().toISOString() };
      update(ref(db), updates2)
        .then(() => {
          toast.success(
            `"${newPostToClub.PostTitle}" post request has been accepted`
          );
        })
        .catch(() => {
          toast.error("Error accepting the post request please try again");
        });
    };

    const removePostReq = (deletedPost) => {
      const starCountRef = ref(
        db,
        "req-posts-list/" + deletedPost.clubId + "/" + deletedPost.PostId
      );
      remove(starCountRef);
    };

    const editPostReqStatus = (editedStatus) => {
      const updates = {};
      updates[
        "req-status-list/post-request/" +
          editedStatus.clubId +
          "/" +
          editedStatus.reqId
      ] = editedStatus;
      update(ref(db), updates);
    };

    if (initialLoad) {
      // fetch the current posts list requests at startup
      fetchCurrentUserClub();
      initialLoad = false;
    }

    // handle the acception of the post request
    if (
      initialLoad === false &&
      reqPostData !== null &&
      reqPostsList !== null
    ) {
      addNewPostToClub(reqPostData.info);
      editPostReqStatus(reqPostData.status);
      removePostReq(reqPostData.info);
      // TODO: CHECK IF THIS WORKS
      dispatch(eventsActions.setShowPostDetails(false));
      dispatch(eventsActions.setReqPostData(null));
    }

    // handle the rejection of post request

    if (
      initialLoad === false &&
      rejectPostStatus !== null &&
      reqPostsList !== null
    ) {
      editPostReqStatus(rejectPostStatus);
      removePostReq(rejectPostStatus);
      // TODO: CHECK IF THIS WORKS
      dispatch(eventsActions.setShowPostDetails(false));
      dispatch(eventsActions.setRejectPostStatus(null));
      toast.success("The post request has been rejected");
    }
  }, [dispatch, db, reqPostData, reqPostsList, rejectPostStatus]);

  let postsList = null;

  if (reqPostsList === null && isFetching === true) {
    postsList = <BarLoader requests={true} />;
  }

  if (reqPostsList !== null) {
    postsList = Object.values(reqPostsList).map((club) => {
      return Object.values(club).map((reqPost) => {
        return (
          <ClubPostItem
            key={reqPost.PostId}
            id={reqPost.PostId}
            clubId={reqPost.clubId}
            CName={reqPost.clubName}
            CMName={reqPost.clubManager}
            CLogo={reqPost.clubIcon}
            PostName={reqPost.PostTitle}
            CMLogo={CM_Logo}
            PostImage={reqPost.PostImage}
            PostStatus={reqPost.PostStatus}
            description={reqPost.description}
            requestPost={reqPost}
          />
        );
      });
    });
  }

  if (
    (reqPostsList === null || typeof reqPostsList === "string") &&
    isFetching === false
  ) {
    postsList = (
      <p className={styles["no-req-post-item"]}>
        There is no post requests at the moment.
      </p>
    );
  }

  return (
    <section className={styles["club-post"]}>
      <ul className={styles["club-post-list"]}>{postsList}</ul>
      {reqPostsList !== null && !showDetails && <DetailsHidden DName="post" />}
      {showDetails && <ClubPostRequestDetails />}
    </section>
  );
};

export default ClubPostRequest;
