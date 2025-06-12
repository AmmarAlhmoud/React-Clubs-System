import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { getAuthUserId } from "../../util/auth";
import { uiActions } from "../../store/ui-slice";
import { useTranslation } from "react-i18next";
import { clubActions } from "../../store/club-slice";
import { toast } from "sonner";

import next_event from "../../assets/icons/CM-Dashboard/next_event.png";
import total_events from "../../assets/icons/CM-Dashboard/total_events.png";
import responded from "../../assets/icons/CM-Dashboard/responded.png";
import pending from "../../assets/icons/CM-Dashboard/pending.png";
import accepted from "../../assets/icons/CM-Dashboard/accepted.png";
import rejected from "../../assets/icons/CM-Dashboard/rejected.png";
import question from "../../assets/icons/CM-Dashboard/question.png";

import WeeklyCalender from "../Dashboard/WeeklyCalender";
import Modal from "../MyClub/DelModal";
import BarLoader from "../UI/BarLoader";
import RecentEventsCarousel from "./RecentEventsCarousel";
import JoinReqList from "./JoinReqList";

import styles from "./CmDashboard.module.css";

let initialLoad = true;

const CmDashboard = () => {
  const { t } = useTranslation();

  // For Event or Post Deletion Modal
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // For Request Deletion Modal
  // const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [preformAction, setPreformAction] = useState(false);
  const dispatch = useDispatch();
  const db = database;
  const userId = getAuthUserId();

  const cMEventsList = useSelector((state) => state.ui.cMEventsList);

  const currentClubMGDashData = useSelector(
    (state) => state.ui.currentClubMGDashData
  );

  const currentEventReqStatusCM = useSelector(
    (state) => state.ui.currentEventReqStatusCM
  );
  const currentPostReqStatusCM = useSelector(
    (state) => state.ui.currentPostReqStatusCM
  );
  const currentPostEditReqStatusCM = useSelector(
    (state) => state.ui.currentPostEditReqStatusCM
  );
  const currentEventEditReqStatusCM = useSelector(
    (state) => state.ui.currentEventEditReqStatusCM
  );

  const currentClubEditReqStatusCM = useSelector(
    (state) => state.ui.currentClubEditReqStatusCM
  );

  const clubsListForCM = useSelector((state) => state.ui.clubsListForCM);
  const recentEventsData = useSelector((state) => state.ui.recentEventsData);

  const statusModal = useSelector((state) => state.ui.statusModal);
  const reqBoxStatusData = useSelector((state) => state.ui.reqBoxStatusData);

  // For responded request status icon (accepted or rejected)
  let ResponseStatus = true;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      dispatch(uiActions.setIsCmDashLoading(true));
      const starCountRef = ref(db, "clubslist/" + userId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.setCurrentClubMGDashData(data));
        setIsFetching(false);
        dispatch(uiActions.setIsCmDashLoading(false));
      });
    };
    const fetchCurrentAllClub = () => {
      const starCountRef1 = ref(db, "clubslist");
      onValue(starCountRef1, (snapshot) => {
        const data = snapshot.val();
        dispatch(uiActions.replaceClubsListForCM(data));
      });
    };
    const fetchCurrentReqStatusClub = (from) => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-status-list/" + from + userId);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (from === "event-request/") {
          dispatch(uiActions.setCurrentEventReqStatusCM(data));
        }
        if (from === "post-request/") {
          dispatch(uiActions.setCurrentPostReqStatusCM(data));
        }
        if (from === "post-edit-request/") {
          dispatch(uiActions.setCurrentPostEditReqStatusCM(data));
        }
        if (from === "event-edit-request/") {
          dispatch(uiActions.setCurrentEventEditReqStatusCM(data));
        }
        if (from === "edit-club-req/") {
          dispatch(uiActions.setCurrentClubEditReqStatusCM(data));
        }
        setIsFetching(false);
      });
    };
    const fetchJoinClubReqList = () => {
      const starCountRef = ref(db, `req-join-club-list/${userId}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setJoinClubReqList(data));
      });
    };

    // fetch the current user club at startup
    if (initialLoad) {
      fetchCurrentUserClub();
      fetchCurrentAllClub();
      fetchJoinClubReqList();
      fetchCurrentReqStatusClub("event-request/");
      fetchCurrentReqStatusClub("post-request/");
      fetchCurrentReqStatusClub("post-edit-request/");
      fetchCurrentReqStatusClub("event-edit-request/");
      fetchCurrentReqStatusClub("edit-club-req/");
      initialLoad = false;
    }

    if (initialLoad === false && currentClubMGDashData !== null) {
      const fetchedEventsList = currentClubMGDashData?.events;
      if (fetchedEventsList !== undefined) {
        dispatch(uiActions.setCMEventsList(Object.values(fetchedEventsList)));
      }
    }

    if (initialLoad === false && clubsListForCM !== null) {
      Object.values(clubsListForCM).map((club) => {
        const fetchedEventsList = club?.events;
        if (fetchedEventsList !== undefined) {
          dispatch(
            uiActions.setRecentEventsData(Object.values(fetchedEventsList))
          );
        }
      });
    }
  }, [
    dispatch,
    db,
    userId,
    currentClubMGDashData,
    currentEventReqStatusCM,
    currentPostReqStatusCM,
    currentPostEditReqStatusCM,
    currentEventEditReqStatusCM,
    currentClubEditReqStatusCM,
    clubsListForCM,
    reqBoxStatusData,
  ]);

  useEffect(() => {
    const deleteMemberFromClub = (deletedClub) => {
      const starCountRef = ref(
        db,
        `/clubslist/${deletedClub.info.clubId}/members/${deletedClub.info.userId}`
      );
      remove(starCountRef);
    };

    const editClubAfterJoin = (editedData) => {
      const updates = {
        [`/clubslist/${editedData.info.clubId}/members/${editedData.info.userId}`]:
          editedData.info,
      };
      update(ref(db), updates)
        .then(() =>
          toast.success(
            `"${editedData.info.userName}" ${t(
              `cm-dashboard.${editedData.status.status}`
            )}`
          )
        )
        .catch(() =>
          toast.error(t(`cm-dashboard.error-${editedData.status.status}`))
        );
    };

    const editJoiningReqStatus = (editedStatus) => {
      const updates = {};
      updates[
        "req-join-club-list/" +
          editedStatus.info.clubId +
          "/" +
          editedStatus.info.userId
      ] = editedStatus;
      update(ref(db), updates)
        .then(() => {
          if (editedStatus.status.status === "rejected") {
            toast.success(
              `"${editedStatus.info.userName}" ${t(
                `cm-dashboard.${editedStatus.status.status}`
              )}`
            );
          }
        })
        .catch(() => {
          if (editedStatus.status.status === "rejected") {
            toast.error(t(`cm-dashboard.error-${editedStatus.status.status}`));
          }
        });
    };

    if (
      initialLoad === false &&
      reqBoxStatusData?.info !== undefined &&
      reqBoxStatusData?.status !== undefined &&
      preformAction
    ) {
      if (reqBoxStatusData !== null) {
        const { status } = reqBoxStatusData;
        if (status.status === "accepted") {
          editClubAfterJoin(reqBoxStatusData);
          editJoiningReqStatus(reqBoxStatusData);
        }
        if (status.status === "rejected") {
          editJoiningReqStatus(reqBoxStatusData);
        }

        if (status.status === "deleted") {
          deleteMemberFromClub(reqBoxStatusData);
          editJoiningReqStatus(reqBoxStatusData);
        }

        dispatch(uiActions.setReqBoxStatusData(null));
        dispatch(uiActions.setStatusModal(null));
        setPreformAction(false);
      }
    }
  }, [db, dispatch, preformAction, reqBoxStatusData, t]);


  let totalEvents = 0;

  if (cMEventsList !== null) {
    totalEvents = cMEventsList.length;
  }

  let pendingList = [];
  let pendingRequestsList = [];
  let acceptingList = [];
  let acceptingRequestsList = [];

  let reqList = [];

  if (currentEventReqStatusCM !== null) {
    const eventReq = Object.values(currentEventReqStatusCM);
    reqList.push(...eventReq);
  }

  if (currentPostReqStatusCM !== null) {
    const postReq = Object.values(currentPostReqStatusCM);
    reqList.push(...postReq);
  }

  if (currentPostEditReqStatusCM !== null) {
    const postEditReq = Object.values(currentPostEditReqStatusCM);
    reqList.push(...postEditReq);
  }

  if (currentEventEditReqStatusCM !== null) {
    const eventEditReq = Object.values(currentEventEditReqStatusCM);
    reqList.push(...eventEditReq);
  }

  if (currentClubEditReqStatusCM !== null) {
    const clubEditReq = Object.values(currentClubEditReqStatusCM);
    reqList.push(...clubEditReq);
  }

  if (reqList.length > 0) {
    {
      let reqType;
      pendingList = reqList.map((event, index) => {
        let formattedDate = new Date(event?.reqDate).toLocaleDateString(
          "en-US",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        const month = formattedDate.split(" ")[0];
        formattedDate = formattedDate.replace(month, t(`months.${month}`));

        let type = event.reqType;
        if (event.status === "pending") {
          if (type === "event-request") {
            reqType = t("cm-dashboard.responded-status.event");
          }
          if (type === "post-request") {
            reqType = t("cm-dashboard.responded-status.post");
          }
          if (type === "edit-event") {
            reqType = t("cm-dashboard.responded-status.edit-event");
          }
          if (type === "edit-post") {
            reqType = t("cm-dashboard.responded-status.edit-post");
          }
          if (type === "edit-club") {
            reqType = t("cm-dashboard.responded-status.edit-club");
          }

          pendingRequestsList.push(1);
          return (
            <div key={index} className={styles.dataItem}>
              <div>
                <span>{formattedDate}</span> <span>{reqType}</span>
              </div>
              <div className={styles.icons}></div>
            </div>
          );
        }
      });
    }

    {
      let reqType;
      acceptingList = reqList.map((event, index) => {
        let formattedDate = new Date(event?.reqDate).toLocaleDateString(
          "en-US",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        const month = formattedDate.split(" ")[0];
        formattedDate = formattedDate.replace(month, t(`months.${month}`));

        let type = event.reqType;

        if (type === "event-request") {
          reqType = t("cm-dashboard.responded-status.event");
        }
        if (type === "post-request") {
          reqType = t("cm-dashboard.responded-status.post");
        }
        if (type === "edit-event") {
          reqType = t("cm-dashboard.responded-status.edit-event");
        }
        if (type === "edit-post") {
          reqType = t("cm-dashboard.responded-status.edit-post");
        }
        if (type === "edit-club") {
          reqType = t("cm-dashboard.responded-status.edit-club");
        }
        if (event.status === "accepted") {
          ResponseStatus = true;
          acceptingRequestsList.push(1);
          return (
            <div key={index} className={styles.dataItem}>
              <div>
                <span>{formattedDate}</span> <span>{reqType}</span>
                <h3>{event.location?.label}</h3>
              </div>
              <div className={styles.icons}>
                {/* Check response status and render appropriate icon */}
                {ResponseStatus ? (
                  <img src={accepted} alt="accepted" />
                ) : (
                  <img src={rejected} alt="rejected" />
                )}
              </div>
            </div>
          );
        }
        if (event.status === "rejected") {
          ResponseStatus = false;

          acceptingRequestsList.push(1);
          return (
            <div key={index} className={styles.dataItem}>
              <div>
                <span>{formattedDate}</span> <span>{reqType}</span>
                <h3>{event.location?.label}</h3>
              </div>
              <div className={styles.icons}>
                {/* Check response status and render appropriate icon */}
                {ResponseStatus ? (
                  <img src={accepted} alt="accepted" />
                ) : (
                  <img src={rejected} alt="rejected" />
                )}
              </div>
            </div>
          );
        }
      });
    }
  }

  const isCloserDate = (currentDate, isoStringDate) => {
    // Extract year, month, and day from ISO string
    const comparedYear = parseInt(isoStringDate.slice(0, 4), 10);
    const comparedMonth = parseInt(isoStringDate.slice(5, 7), 10) - 1; // Adjust for zero-based months
    const comparedDay = parseInt(isoStringDate.slice(8, 10), 10);

    const currentDateInDays =
      currentDate.getFullYear() * 365 +
      currentDate.getMonth() * 30 +
      currentDate.getDate();
    const comparedDateInDays =
      comparedYear * 365 + comparedMonth * 30 + comparedDay;

    // Calculate absolute difference in days (ignoring time)
    const diff = Math.abs(currentDateInDays - comparedDateInDays);

    // Assume any date is closer than itself (for edge cases)
    return diff > 0;
  };

  let myNextEvent = null;

  if (recentEventsData !== null) {
    // Find the index of the closest event using reduce and Math.min
    const closestEventIndex = recentEventsData.reduce(
      (closestIndex, eventItem, index) => {
        const isCurrentCloser = isCloserDate(new Date(), eventItem.Date);
        if (closestIndex === null || isCurrentCloser) {
          return index;
        } else {
          return closestIndex;
        }
      },
      null
    );

    // If a closest event was found, extract it from the array
    if (closestEventIndex !== null) {
      myNextEvent = recentEventsData[closestEventIndex];
    }
  }

  let formattedDate;

  if (myNextEvent !== null) {
    formattedDate = new Date(myNextEvent?.Date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const month = formattedDate.split(" ")[0];
    formattedDate = formattedDate.replace(month, t(`months.${month}`));
  }

  return (
    <main className={styles.container}>
      {/* Recent Events Section */}
      <section className={styles.recent}>
        <h1>{t("cm-dashboard.recent-new-events")}</h1>
        <div className={styles.renderedEvents}>
          {isFetching && <BarLoader noItemWeeklyST={true} />}
          {recentEventsData !== null && (
            <RecentEventsCarousel items={recentEventsData} />
          )}
        </div>
      </section>
      {/* Upper Right Stats Section */}
      <section className={styles.statsTop}>
        <div>
          <img src={next_event} alt="" />
          <div className={styles.inner}>
            <h1>{t("cm-dashboard.my-next-event")}</h1>
            <h2>{myNextEvent !== null && formattedDate}</h2>
            <h3>
              {myNextEvent !== null && myNextEvent?.Stime?.label} -{" "}
              {myNextEvent !== null && myNextEvent?.Etime?.label}
            </h3>
          </div>
        </div>
        <div>
          <img src={total_events} alt="" />
          <div className={styles.inner}>
            <h1>{t("cm-dashboard.total-events")}</h1>
            <h2>
              <span>{totalEvents}</span> {t("cm-dashboard.event")}
            </h2>
          </div>
        </div>
      </section>
      {/* Weekly Calender Section */}
      <section className={styles.downSection}>
        <section className={styles.calender}>
          <WeeklyCalender />
        </section>
        <section className={styles.joinContainer}>
          <JoinReqList title={t("cm-dashboard.manage-members")} type="members"/>
          <JoinReqList title={t("cm-dashboard.requests-box")} type="request" />
        </section>
      </section>
      {/* Lower Right Stats Section */}
      <section className={styles.statsBottom}>
        {/* Responded events section*/}
        <div className={styles.responded}>
          <div>
            <img src={responded} alt="responded" />
            <h1>
              <span>{acceptingRequestsList?.length || 0}</span>{" "}
              {t("cm-dashboard.responded")}
            </h1>
          </div>
          <div className={styles.respondedData}>
            {/* Rendering Responded Events*/}
            <h2>{t("cm-dashboard.request-results")}</h2>
            <div className={styles.renderedResponses}>{acceptingList}</div>
          </div>
          <div className={styles.filler}></div>
        </div>
        {/* Requested events section*/}
        <div className={styles.pending}>
          <div>
            <img src={pending} alt="pending" />
            <h1>
              <span>{pendingRequestsList?.length || 0}</span>{" "}
              {t("cm-dashboard.pending")}
            </h1>
          </div>
          <div className={styles.pendingData}>
            {/* Rendering Requested Events*/}
            <h2>{t("cm-dashboard.pending-requests")}</h2>
            <div className={styles.renderedResponses}>{pendingList}</div>
          </div>
          <div className={styles.filler}>
            <Link to="/request-event">
              <button className={styles.btn2}>
                {t("cm-dashboard.add-event-request")}
              </button>
            </Link>
            <Link to="/request-post">
              <button className={styles.btn2}>
                {t("cm-dashboard.add-post-request")}
              </button>
            </Link>
          </div>
        </div>
      </section>
      {/* TODO: Delete/Accept/Reject members Modal */}
      <Modal
        open={statusModal === "deleted"}
        onClose={() => dispatch(uiActions.setStatusModal(null))}
        icon={question}
        title={t("cm-dashboard.req-delete-box")}
        deleteMemberReq={statusModal === "deleted"}
        onConfirmDelete={() => setPreformAction(true)}
      />
      <Modal
        open={statusModal === "accepted"}
        onClose={() => dispatch(uiActions.setStatusModal(null))}
        icon={question}
        title={t("cm-dashboard.req-accept-box")}
        joinClubReq={statusModal === "accepted"}
        onConfirmDelete={() => setPreformAction(true)}
      />
      <Modal
        open={statusModal === "rejected"}
        onClose={() => dispatch(uiActions.setStatusModal(null))}
        icon={question}
        title={t("cm-dashboard.req-reject-box")}
        rejectMemberReq={statusModal === "rejected"}
        onConfirmDelete={() => setPreformAction(true)}
      />
      {/* TODO: Post/Event Deletion Modal */}
      {/* <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={question}
        title={t("cm-dashboard.del-post-event")}
        onConfirmDelete={""}
      /> */}
      {/* TODO: Request Cancel Modal */}
      {/* <Modal
        open={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        icon={question}
        title={t("cm-dashboard.del-request")}
        onConfirmDelete={""}
      /> */}
    </main>
  );
};

export default CmDashboard;
