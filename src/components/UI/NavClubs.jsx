import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import ColoredButton from "./ColoredButton";
import CustomSelectInput from "./Search/CustomSelectInput";
import styles from "./NavClubs.module.css";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import cateIcon from "../../assets/icons/ClubsList/categories.png";
import searchIcon from "../../assets/icons/ClubsList/search.png";
import { clubActions } from "../../store/club-slice";
import { useTranslation } from "react-i18next";

const NavClubs = () => {
  const { t } = useTranslation();

  const db = database;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [searchedName, setSearchedName] = useState("");
  const [isNameFocus, setIsNameFocus] = useState(false);
  const searchedCategories = useSelector(
    (state) => state.ui.searchedCategories
  );
  const clubsNameList = useSelector((state) => state.club.clubsNameList); // Make sure this exists in your store

  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        inputRef.current &&
        !menuRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsNameFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetFilterHandler = () => {
    setClearFilter(false);
    dispatch(uiActions.setResetFilter(true));
  };

  const filteredClubsByName = (clubsList, searchedWord) => {
    const searchKeyWord = searchedWord.trim().toLowerCase();
    return Object.values(clubsList)
      .filter((clubItem) => {
        const clubName = clubItem.clubName?.trim().toLowerCase();
        return clubName?.startsWith(searchKeyWord);
      })
      .slice(0, 4);
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setSearchedName(value);
    setIsNameFocus(value.trim().length > 0);
  };

  const handleSuggestionClick = (clubName) => {
    setSearchedName(clubName);
    setIsNameFocus(false);
  };

  const searchHandler = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    dispatch(
      uiActions.setSearchParams({
        searchedWord: searchedName,
        searchedCategories,
      })
    );

    if (searchedName || searchedCategories) {
      setClearFilter(true);
    }

    setIsSubmitting(false);
    setSearchedName("");
    dispatch(uiActions.setSearchedCategories(null));
  };

  useEffect(() => {
    const starCountRef = ref(db, "/clubslist");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      dispatch(clubActions.replaceClubsNameList(data));
    });
  }, [db, dispatch, searchedName]);

  // Generate suggestions content
  let content = null;
  if (clubsNameList && searchedName.trim().length > 0 && isNameFocus) {
    const filteredClubs = filteredClubsByName(clubsNameList, searchedName);

    content =
      filteredClubs.length > 0 ? (
        filteredClubs.map((club) => (
          <div
            key={club.clubId}
            className={styles["suggestion-menu-item"]}
            onClick={() => handleSuggestionClick(club.clubName)}
          >
            <p>{club.clubName}</p>
          </div>
        ))
      ) : (
        <div className={styles["no-results"]}>
          {t("clubs-list.club-card.club-edit-req.nav.no-match")}
        </div>
      );
  }

  return (
    <form className={styles["form-search"]} onSubmit={searchHandler}>
      {isNameFocus && searchedName.trim().length > 0 && (
        <div className={styles["suggestion-menu"]} ref={menuRef}>
          {content}
        </div>
      )}
      <nav className={styles.nav}>
        <div className={styles["input-wrapper"]}>
          <img src={searchIcon} alt="search" />
          <input
            type="text"
            ref={inputRef}
            placeholder={t("clubs-list.club-card.club-edit-req.nav.club-name")}
            name="clubName"
            autoComplete="off"
            value={searchedName}
            onChange={handleNameChange}
            onFocus={() => {
              if (searchedName.trim().length > 0) {
                setIsNameFocus(true);
              }
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.cateSearch}>
          <img src={cateIcon} alt="categories" />
          <CustomSelectInput disabled={isSubmitting} />
        </div>

        <div>
          {!clearFilter && (
            <ColoredButton type="submit">
              {t("clubs-list.club-card.club-edit-req.nav.search")}
            </ColoredButton>
          )}
          {clearFilter && (
            <ColoredButton red={true} onClick={resetFilterHandler}>
              X
            </ColoredButton>
          )}
        </div>
      </nav>
    </form>
  );
};

export default NavClubs;
