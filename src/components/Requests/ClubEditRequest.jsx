import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { clubActions } from "../../store/club-slice";
import { toast } from "sonner";

import EventRequestItem from "./EventRequestItem";
import BarLoader from "../UI/BarLoader";

import CM_Logo from "../../assets/icons/EventsList/club_manager_logo.png";

import styles from "./ClubEditRequest.module.css";

let initialLoad = true;

const ClubEditRequest = () => {
  const reqClubEditList = useSelector((state) => state.club.reqClubEditList);
  const updatedClubInfo = useSelector((state) => state.club.updatedClubInfo);

  const rejectClubEditingReq = useSelector(
    (state) => state.club.rejectClubEditingReq
  );
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const db = database;

  useEffect(() => {
    const fetchCurrentUserClub = () => {
      setIsFetching(true);
      const starCountRef = ref(db, "req-edit-club-list");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.setReqClubEditList(data));
        setIsFetching(false);
      });
    };

    const editExistingClub = (editedClub) => {
      const updates = {};
      updates["clubslist/" + editedClub.clubId] = editedClub;
      update(ref(db), updates)
        .then(() => {
          toast.success(
            `"${editedClub.clubName}" club edit request has been accepted`
          );
        })
        .catch(() => {
          toast.error("Error editting the club please try again");
        });
    };

    const removeEditingReq = (deletedClub) => {
      const starCountRef = ref(
        db,
        "req-edit-club-list/" + deletedClub.clubId + "/" + deletedClub.clubId
      );
      remove(starCountRef);
    };

    const editClubReqStatus = (editedStatus) => {
      const updates = {};
      updates[
        "req-status-list/edit-club-req/" +
          editedStatus.clubId +
          "/" +
          editedStatus.clubId
      ] = editedStatus;
      update(ref(db), updates);
    };

    if (initialLoad) {
      fetchCurrentUserClub();
      initialLoad = false;
    }

    if (
      initialLoad === false &&
      updatedClubInfo?.info !== undefined &&
      updatedClubInfo?.status !== undefined &&
      reqClubEditList !== null
    ) {
      if (updatedClubInfo !== null) {
        console.log("from if :: ", updatedClubInfo);
        editExistingClub(updatedClubInfo.info);
        editClubReqStatus(updatedClubInfo.status);
        removeEditingReq(updatedClubInfo.info);
        dispatch(clubActions.setUpdatedClubInfo(null));
      }
    }

    if (
      initialLoad === false &&
      rejectClubEditingReq !== null &&
      reqClubEditList !== null
    ) {
      removeEditingReq(rejectClubEditingReq);
      editClubReqStatus(rejectClubEditingReq);
      dispatch(clubActions.rejectClubEditingReq(null));
      toast.success("The club edit request has been rejected");
    }
  }, [dispatch, db, updatedClubInfo, rejectClubEditingReq, reqClubEditList]);

  let editClubList = null;

  if (reqClubEditList === null && isFetching === true) {
    editClubList = <BarLoader requests={true} />;
  }

  if (reqClubEditList !== null) {
    Object.values(reqClubEditList).map((editClub) => {
      editClubList = Object.values(editClub).map((club) => {
        return (
          <EventRequestItem
            key={club.clubId}
            id={club.clubId}
            clubId={club.clubId}
            CName={club.clubName}
            CMName={club.managerName}
            CLogo={club.clubIcon}
            CMLogo={CM_Logo}
            ClubEdit={true}
            type="club-edit-request"
          />
        );
      });
    });
  }

  if (
    (reqClubEditList === null || typeof reqClubEditList === "string") &&
    isFetching === false
  ) {
    editClubList = (
      <p className={styles["no-req-edit-club-item"]}>
        There is no club edit request at the moment.
      </p>
    );
  }

  return (
    <section className={styles["event-req"]}>
      {/* TODO: Make this request item fetch dynamicaly */}
      <ul className={styles["event-req-list"]}>{editClubList}</ul>
    </section>
  );
};

export default ClubEditRequest;