import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue, remove, set } from "firebase/database";
import { getAuthUserId } from "../../util/auth";
import { clubActions } from "../../store/club-slice";
import { getAuthUserType } from "../../util/auth";
import { toast } from "sonner";

import EventItem from "./EventItem";
import PostItem from "./PostItem";

import mailIcon from "../../assets/icons/MyClub/email.png";
import telIcon from "../../assets/icons/MyClub/phone.png";
import CateList from "../EventsList/CateList";
import CateItem from "../EventsList/CateItem";

import styles from "./MyClub.module.css";

import BarLoader from "../UI/BarLoader";
import { useTranslation } from "react-i18next";

// For showing - hiding editing buttons (editor mode)
let showEditButtons = true;
// let initialLoad = true;

const MyClub = () => {
  const { t } = useTranslation();

  window.scrollTo(0, 0);

  let clubData = {};
  const currentClubInfo = useSelector((state) => state.club.currentClubInfo);
  const currentUserClubInfo = useSelector(
    (state) => state.club.currentUserClubInfo
  );
  const currentClubInfoEvent = useSelector(
    (state) => state.club.currentClubInfoEvent
  );
  const userType = getAuthUserType();
  const clubPageForCl =
    userType === "Cl" && window.location.pathname.startsWith("/my-club");
  const clubPageFromEvent =
    window.location.pathname.startsWith("/events-list/");
  const [isFetching, setIsFetching] = useState(false);
  const { clubPageId } = useParams();

  const deletedEvent = useSelector((state) => state.club.deletedEvent);
  const deletedPost = useSelector((state) => state.club.deletedPost);

  if (currentClubInfo) {
    clubData = currentClubInfo;
  }
  if (currentUserClubInfo && clubPageForCl) {
    clubData = currentUserClubInfo;
    localStorage.setItem("CMName", clubData.managerName);
  }

  if (clubPageFromEvent && currentClubInfoEvent) {
    clubData = currentClubInfoEvent;
  }

  let formattedDate = new Date(clubData?.createdDate).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const month = formattedDate.split(" ")[0];
  formattedDate = formattedDate.replace(month, t(`months.${month}`));

  // console.log(clubData);

  // ** logic starting point

  const dispatch = useDispatch();
  const db = database;
  const userId = getAuthUserId();
  const reqEditPost = useSelector((state) => state.club.reqEditPost);
  const reqEditEvent = useSelector((state) => state.club.reqEditEvent);
  // const currentClubEventsNum = useSelector(
  //   (state) => state.club.currentClubEventsNum
  // );

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "clubslist/" + userId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setCurrentUserClubInfo(data));
        setIsFetching(false);
      });
    };
    const fetchCurrentUserClubFromEvent = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "/clubslist/" + clubPageId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setCurrentClubInfoEvnet(data));
        setIsFetching(false);
      });
    };
    const deletePost = (deletedPost) => {
      const starCountRef1 = ref(
        db,
        "clubslist/" + deletedPost.clubId + "/posts/" + deletedPost.PostId
      );
      remove(starCountRef1);

      const starCountRef2 = ref(
        db,
        "posts-list/" + deletedPost.clubId + "/" + deletedPost.PostId
      );
      remove(starCountRef2)
        .then(() => {
          toast.success(
            `"${deletedPost.PostTitle}" ${t("club-page.del-post")}`
          );
        })
        .catch(() => {
          toast.error(t("club-page.error-del-post"));
        });
    };
    const deleteEvent = (deletedEvent) => {
      const starCountRef1 = ref(
        db,
        "clubslist/" + deletedEvent.clubId + "/events/" + deletedEvent.EventId
      );
      remove(starCountRef1);

      const starCountRef2 = ref(
        db,
        "events-list/" + deletedEvent.clubId + "/" + deletedEvent.EventId
      );
      remove(starCountRef2)
        .then(() => {
          toast.success(
            `"${deletedEvent.EventName}" ${t("club-page.del-event")}`
          );
        })
        .catch(() => {
          toast.error(t("club-page.error-del-event"));
        });
    };
    const addNewEditPostReq = (newEditPost) => {
      set(
        ref(
          db,
          "req-edit-posts-list/" + newEditPost.clubId + "/" + newEditPost.PostId
        ),
        {
          ...newEditPost,
        }
      )
        .then(() => {
          toast.success(
            `"${newEditPost.PostTitle}" ${t("club-page.post-edit-req")}`
          );
        })
        .catch(() => {
          toast.error(t("club-page.error-post-edit-req"));
        });
    };
    const addReqStatusForPost = (newReqStatus, to) => {
      set(
        ref(
          db,
          "req-status-list/" +
            to +
            newReqStatus.clubId +
            "/" +
            newReqStatus.PostId
        ),
        {
          ...newReqStatus,
          reqDate: new Date().toISOString(),
        }
      );
    };
    const addNewEditEventReq = (newEditEvent) => {
      set(
        ref(
          db,
          "req-edit-events-list/" +
            newEditEvent.clubId +
            "/" +
            newEditEvent.EventId
        ),
        {
          ...newEditEvent,
        }
      )
        .then(() => {
          toast.success(
            `"${newEditEvent.EventName}" ${t("club-page.event-edit-req")}`
          );
        })
        .catch(() => {
          toast.error(t("club-page.error-event-edit-req"));
        });
    };
    const addReqStatusForEvent = (newReqStatus, to) => {
      set(
        ref(
          db,
          "req-status-list/" +
            to +
            newReqStatus.clubId +
            "/" +
            newReqStatus.EventId
        ),
        {
          ...newReqStatus,
          reqDate: new Date().toISOString(),
        }
      );
    };

    // fetch the current user club at startup
    if (clubPageForCl) {
      fetchCurrentUserClub();
    }
    // to fetch the correct club info from the events list.
    if (clubPageId !== null) {
      fetchCurrentUserClubFromEvent();
    }
    // to detele a post from both the posts on the club and from posts-list
    if (deletedPost !== null) {
      deletePost(deletedPost);
      dispatch(clubActions.setDeletedPost(null));
    }
    // to detele a event from both the events on the club and from events-list
    if (deletedEvent !== null) {
      deleteEvent(deletedEvent);
      dispatch(clubActions.setDeletedEvent(null));
    }

    // handle request a post edit
    if (reqEditPost !== null) {
      addNewEditPostReq(reqEditPost.info);
      addReqStatusForPost(reqEditPost.status, "post-edit-request/");
      dispatch(clubActions.setReqEditPost(null));
    }

    if (reqEditEvent !== null) {
      addNewEditEventReq(reqEditEvent.info);
      addReqStatusForEvent(reqEditEvent.status, "event-edit-request/");
      dispatch(clubActions.setReqEditEvent(null));
    }
  }, [
    dispatch,
    db,
    userId,
    clubPageId,
    clubPageForCl,
    deletedPost,
    deletedEvent,
    reqEditPost,
    reqEditEvent,
  ]);

  let eventsList;
  let eventsNumber = 0;
  let postsList;
  let postsNumber = 0;

  if (Object.keys(clubData).length !== 0) {
    const fetchedEventsList = clubData?.events;
    if (fetchedEventsList !== undefined) {
      eventsNumber = Object.values(fetchedEventsList).length || 0;
      eventsList = Object.values(fetchedEventsList)
        .reverse()
        .map((eventItem) => {
          return (
            <EventItem
              key={eventItem.EventId}
              name={eventItem.clubName}
              icon={eventItem.clubIcon}
              event={eventItem}
              canEdit={showEditButtons}
            />
          );
        });
    } else {
      eventsList = <p className={styles.noItem}>{t("club-page.no-events")}</p>;
    }

    const fetchedPostsList = clubData.posts;

    if (fetchedPostsList !== undefined) {
      postsNumber = Object.values(fetchedPostsList).length || 0;
      postsList = Object.values(fetchedPostsList)
        .reverse()
        .map((postItem) => {
          return (
            <PostItem
              key={postItem.PostId}
              name={postItem.clubName}
              icon={postItem.clubIcon}
              post={postItem}
              canEdit={showEditButtons}
            />
          );
        });
    } else {
      postsList = <p className={styles.noItem}>{t("club-page.no-posts")}</p>;
    }
  }

  return (
    <section className={styles.container}>
      {isFetching && <BarLoader clubPage={true} />}
      {!isFetching && (
        <>
          <div className={styles.clubInfo}>
            <div className={styles.clubImages}>
              <img src={clubData?.clubBgImage} alt="Club banner" />
              <img src={clubData?.clubIcon} alt="Icon" />
            </div>
            <div className={styles.clubTitle}>
              <div>
                <h1>{clubData?.clubName}</h1>
                <h2>
                  {t("club-page.manager")} <span>{clubData?.managerName}</span>
                </h2>
                <CateList className={styles.cateList}>
                  {clubData?.categories?.map((cate) => (
                    // TODO: make sure to translate it here also
                    <CateItem
                      key={cate.label}
                      cateName={t(`cate-list-value.${cate?.value}`)}
                    />
                  ))}
                </CateList>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>{t("club-page.created-date")}</th>
                      <th>{t("club-page.posts")}</th>
                      <th>{t("club-page.events")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{formattedDate}</td>
                      <td>{postsNumber}</td>
                      <td>{eventsNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <section className={styles.details}>
            <div className={styles.clubDesc}>
              <h1>{t("club-page.desc")}</h1>
              <p>{clubData?.description}</p>
            </div>
            <div className={styles.clubContact}>
              <h1>{t("club-page.contact")}</h1>
              <h2>
                <img src={mailIcon} alt="" />
                <span>{clubData?.email}</span>
              </h2>
              <h2>
                <img src={telIcon} alt="" />
                <span>{clubData?.phoneNumber}</span>
              </h2>
            </div>
            <div className={styles.events}>
              {postsList}
              {eventsList}
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default MyClub;
