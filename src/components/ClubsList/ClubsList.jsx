// src/components/Clubs/ClubsList.jsx
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, onValue, set, update, remove } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "sonner";

import { clubActions } from "../../store/club-slice";
import { uiActions } from "../../store/ui-slice";

import NavClubs from "../UI/NavClubs";
import ClubCard from "./ClubCard";
import BarLoader from "../UI/BarLoader";
import styles from "./ClubsList.module.css";

const ClubsList = () => {
  const dispatch = useDispatch();
  const db = database;

  // newClubObj is either null or { clubData, managerId }
  const newClubObj = useSelector((s) => s.club.newClub);
  const clubsList = useSelector((s) => s.club.clubsList);
  const editedClub = useSelector((s) => s.club.editedClub);
  const reqEditClub = useSelector((s) => s.club.reqEditClub);
  const deletedClub = useSelector((s) => s.club.deletedClub);
  const searchParams = useSelector((s) => s.ui.searchParams);
  const resetFilter = useSelector((s) => s.ui.resetFilter);

  const [filtered, setFiltered] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const initialLoad = useRef(true);

  // 1) Load all clubs once
  useEffect(() => {
    const starRef = ref(db, "clubslist");
    onValue(starRef, (snap) => {
      dispatch(clubActions.replaceClubsList(snap.val()));
    });
    initialLoad.current = false;
  }, [db, dispatch]);

  // 2) Only write the NEW club when newClubObj arrives
  useEffect(() => {
    if (!initialLoad.current && newClubObj) {
      const { clubData, managerId } = newClubObj;
      set(ref(db, `clubslist/${managerId}`), {
        ...clubData,
        clubId: managerId,
      })
        .then(() =>
          toast.success(`"${clubData.clubName}" club has been created!`)
        )
        .catch(() => toast.error("Error creating the club"))
        .finally(() => dispatch(clubActions.addNewClub(null)));
    }
  }, [newClubObj, db, dispatch]);

  // 3) Handle edits, delete, requests, and search
  useEffect(() => {
    if (initialLoad.current || !clubsList) return;

    // — EDIT
    if (editedClub) {
      const updates = { [`/clubslist/${editedClub.clubId}`]: editedClub };
      update(ref(db), updates)
        .then(() =>
          toast.success(`"${editedClub.clubName}" edited successfully!`)
        )
        .catch(() => toast.error("Error editing the club"));
      dispatch(clubActions.addEditedClub(null));
    }

    // — SEND EDIT REQUEST
    if (reqEditClub) {
      const { info, status } = reqEditClub;
      set(ref(db, `req-edit-club-list/${info.clubId}/${info.clubId}`), info);
      set(
        ref(
          db,
          `req-status-list/edit-club-req/${status.clubId}/${status.clubId}`
        ),
        { ...status, reqDate: new Date().toISOString() }
      );
      toast.success("Your club edit request has been sent!");
      dispatch(clubActions.setReqEditClub(null));
    }

    // — DELETE
    if (deletedClub) {
      remove(ref(db, `clubslist/${deletedClub.clubId}`))
        .then(() =>
          toast.success(`"${deletedClub.clubName}" deleted successfully!`)
        )
        .catch(() => toast.error("Error deleting the club"));
      dispatch(clubActions.addDeletedClub(null));
    }

    // — RESET FILTER
    if (resetFilter) {
      setFiltered([]);
      setNoResults(false);
      dispatch(uiActions.setResetFilter(false));
      return;
    }

    // — SEARCH
    if (searchParams) {
      let results = Object.values(clubsList);
      const kw = searchParams.searchedWord.trim().toLowerCase();
      if (kw) {
        results = results.filter((c) =>
          c.clubName.toLowerCase().startsWith(kw)
        );
      }
      if (searchParams.searchedCategories) {
        results = results.filter((c) =>
          c.categories.some((cat) =>
            searchParams.searchedCategories.some((sc) => sc.value === cat.value)
          )
        );
      }
      setNoResults(results.length === 0);
      setFiltered(results);
      dispatch(uiActions.setSearchParams(null));
    }
  }, [
    db,
    clubsList,
    editedClub,
    reqEditClub,
    deletedClub,
    resetFilter,
    searchParams,
    dispatch,
  ]);

  // Rendering
  let displayed;
  if (!clubsList) {
    displayed = <BarLoader dashboard />;
  } else if (noResults) {
    displayed = (
      <p className={styles["no-search-item"]}>
        No results found for your search.
      </p>
    );
  } else {
    const listToShow =
      filtered.length > 0 ? filtered : Object.values(clubsList);
    displayed = listToShow.map((club) => (
      <ClubCard key={club.clubId} clubData={club} />
    ));
  }

  return (
    <main className={styles.container}>
      <NavClubs />
      <section className={styles.section}>{displayed}</section>
    </main>
  );
};

export default ClubsList;
