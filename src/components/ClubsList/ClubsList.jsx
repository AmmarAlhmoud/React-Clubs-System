/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clubActions } from "../../store/club-slice";
import { toast } from "sonner";
import { ref, onValue, update, set, remove } from "firebase/database";
import { database } from "../../firebase";

import NavClubs from "../UI/NavClubs";
import ClubCard from "./ClubCard";

import styles from "./ClubsList.module.css";
import BarLoader from "../UI/BarLoader";
import { uiActions } from "../../store/ui-slice";

let initialLoad = true;

const ClubsList = () => {
  const dispatch = useDispatch();
  const clubsList = useSelector((state) => state.club.clubsList);
  const newClub = useSelector((state) => state.club.newClub);
  const editedClub = useSelector((state) => state.club.editedClub);
  const reqEditClub = useSelector((state) => state.club.reqEditClub);
  const deletedClub = useSelector((state) => state.club.deletedClub);
  const searchParams = useSelector((state) => state.ui.searchParams);
  const resetFilter = useSelector((state) => state.ui.resetFilter);
  const [filteredClubsList, setFilterdClubsList] = useState([]);
  const [noSearchItemFound, setNoSearchItemFound] = useState(false);
  const db = database;
  const createdManagerId = useSelector((state) => state.club.createdManager);

  useEffect(() => {
    const fetchClubsList = () => {
      const starCountRef = ref(db, "clubslist");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(clubActions.replaceClubsList(data));
      });
    };

    const addNewClub = (newClub) => {
      set(ref(db, "clubslist/" + createdManagerId), {
        ...newClub,
        clubId: createdManagerId,
      })
        .then(() => {
          toast.success(
            `"${newClub.clubName}" club has been created successfully!`
          );
        })
        .catch(() => {
          toast.error("Error creating the club please try again");
        });
    };

    const addReqStatus = (newReqStatus, to) => {
      set(
        ref(
          db,
          "req-status-list/" +
            to +
            newReqStatus.clubId +
            "/" +
            newReqStatus.clubId
        ),
        {
          ...newReqStatus,
          reqDate: new Date().toISOString(),
        }
      );
    };

    const editExistingClub = (editedClub) => {
      const updates = {};
      updates["/clubslist/" + editedClub.clubId] = editedClub;
      update(ref(db), updates)
        .then(() => {
          toast.success(
            `"${editedClub.clubName}" club has been edited successfully!`
          );
        })
        .catch(() => {
          toast.error("Error editting the club please try again");
        });
    };

    const deleteExistingClub = () => {
      const starCountRef = ref(db, "clubslist/" + deletedClub.clubId);

      remove(starCountRef)
        .then(() => {
          toast.success(
            `"${deletedClub.clubName}" club has been deleted successfully!`
          );
        })
        .catch(() => {
          toast.error("Error deleting the club please try again");
        });
    };

    const sendReqEditClub = (editClubInfo) => {
      set(
        ref(
          db,
          "req-edit-club-list/" +
            editClubInfo.clubId +
            "/" +
            editClubInfo.clubId
        ),
        {
          ...editClubInfo,
        }
      )
        .then(() => {
          toast.success(`Your club edit request has been send!`);
        })
        .catch(() => {
          toast.error("Error sending your club edit request please try again");
        });
    };

    // fetch the club list at startup
    if (initialLoad) {
      fetchClubsList();
      initialLoad = false;
    }

    if (initialLoad === false && editedClub !== null && clubsList !== null) {
      editExistingClub(editedClub);
      dispatch(clubActions.addEditedClub(null));
    }

    if (initialLoad === false && reqEditClub !== null && clubsList !== null) {
      console.log(reqEditClub.info);
      sendReqEditClub(reqEditClub.info);
      addReqStatus(reqEditClub.status, "edit-club-req/");
      dispatch(clubActions.setReqEditClub(null));
    }

    // Check for new club and fetched data after initial load at least one club before add new one
    if (
      initialLoad === false &&
      newClub !== null &&
      clubsList !== null &&
      createdManagerId !== null
    ) {
      addNewClub(newClub);
      dispatch(clubActions.addNewClub(null));
      dispatch(clubActions.setCreatedManager(null));
    }
    if (initialLoad === false && deletedClub !== null && clubsList !== null) {
      deleteExistingClub();
      dispatch(clubActions.addDeletedClub(null));
    }

    if (initialLoad === false && resetFilter && clubsList !== null) {
      // for reseting the search filter
      setFilterdClubsList([]);
      setNoSearchItemFound(false);
      dispatch(uiActions.setResetFilter(false));
      return;
    }

    if (initialLoad === false && searchParams !== null && clubsList !== null) {
      // search logic
      let FilterdClubs = [];
      const searchKeyWord = searchParams.searchedWord.trim().toLowerCase();
      // if there is no parameters and the search button clicked
      if (
        !initialLoad &&
        searchParams.searchedWord === "" &&
        searchParams.searchedCategories === null
      ) {
        toast.error(
          "Enter a club name or choose a category to begin your search."
        );
        dispatch(uiActions.setSearchParams(null));
        return;
      }
      // search based on both club name & categories.
      if (
        searchParams.searchedWord !== "" &&
        searchParams.searchedCategories !== null
      ) {
        FilterdClubs = Object.values(clubsList).filter((club) => {
          // Process club name for case-insensitive search (optional truncation removed)
          const clubName =
            club.clubName
              .trim()
              .toLowerCase()
              .substring(0, searchKeyWord.length) === searchKeyWord;

          // Category match logic:
          const categoriesMatch = club.categories.some((category) =>
            searchParams.searchedCategories?.some(
              (searchCate) => category?.value === searchCate?.value
            )
          );

          // Combined search criteria:
          return clubName && categoriesMatch;
        });

        // if the searched item not found.
        if (FilterdClubs.length === 0) {
          setNoSearchItemFound(true);
        }
      }
      // searched based on club name only.
      if (
        searchParams.searchedWord !== "" &&
        searchParams.searchedCategories === null
      ) {
        FilterdClubs = Object.values(clubsList).filter((club) => {
          if (
            club.clubName
              .trim()
              .toLowerCase()
              .substring(0, searchKeyWord.length) === searchKeyWord
          ) {
            return club;
          }
        });
        // if the searched item not found.
        if (FilterdClubs.length === 0) {
          setNoSearchItemFound(true);
        }
      }
      // searched based on the categories only.
      if (
        searchParams.searchedCategories !== null &&
        searchParams.searchedWord === ""
      ) {
        FilterdClubs = Object.values(clubsList).filter((club) => {
          // Category match logic:
          const categoriesMatch = club.categories.some((category) =>
            searchParams.searchedCategories?.some(
              (searchCate) => category?.value === searchCate?.value
            )
          );

          return categoriesMatch;
        });
        // if the searched item not found.
        if (FilterdClubs.length === 0) {
          setNoSearchItemFound(true);
        }
      }
      setFilterdClubsList(FilterdClubs);
      // if the searched item found reset the state.
      if (FilterdClubs.length !== 0) {
        setNoSearchItemFound(false);
      }
      dispatch(uiActions.setSearchParams(null));
    }
  }, [
    dispatch,
    clubsList,
    newClub,
    editedClub,
    deletedClub,
    db,
    searchParams,
    resetFilter,
    noSearchItemFound,
    createdManagerId,
    reqEditClub,
  ]);

  let displayedClubs;

  if (clubsList === null) {
    displayedClubs = <BarLoader dashboard={true} />;
  }

  if (
    clubsList !== null &&
    filteredClubsList.length === 0 &&
    !noSearchItemFound
  ) {
    displayedClubs = Object.values(clubsList)?.map((club) => (
      <ClubCard key={club.clubId} clubData={club} />
    ));
  }

  if (
    clubsList !== null &&
    filteredClubsList.length !== 0 &&
    !noSearchItemFound
  ) {
    displayedClubs = filteredClubsList?.map((club) => (
      <ClubCard key={club.clubId} clubData={club} />
    ));
  }

  if (
    clubsList !== null &&
    noSearchItemFound &&
    filteredClubsList.length === 0
  ) {
    displayedClubs = (
      <p className={styles["no-search-item"]}>
        No results found for your search.
      </p>
    );
  }

  return (
    <main className={styles.container}>
      <NavClubs />
      <section className={styles.section}>{displayedClubs}</section>
    </main>
  );
};

export default ClubsList;
