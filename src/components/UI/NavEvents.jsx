import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import cateIcon from "../../assets/icons/ClubsList/categories.png";
import searchIcon from "../../assets/icons/ClubsList/search.png";
import dateIcon from "../../assets/icons/EventsList/date.png";
import ColoredButton from "./ColoredButton";
import styles from "./NavEvents.module.css";
import CustomSelectInput from "./Search/CustomSelectInput";
import { eventsActions } from "../../store/events-slice";

const NavEvents = () => {
  const db = database;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const searchedEventCategories = useSelector(
    (state) => state.ui.searchedEventCategories
  );
  const eventsNameData = useSelector((state) => state.events.eventsNameData);
  const [dateSelected, setDateSelected] = useState(false);
  const [searchedName, setSearchedName] = useState("");
  const [isNameFocus, setIsNameFocus] = useState(false);

  const dispatch = useDispatch();
  const dateRef = useRef();
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

  const handleDateChange = () => {
    setDateSelected(true);
  };

  const resetFilterHandler = () => {
    setClearFilter(false);
    dispatch(uiActions.setResetEventFilter(true));
  };

  const filteredEventsByName = (eventsData, searchedWord) => {
    const searchKeyWord = searchedWord.trim().toLowerCase();
    return Object.values(eventsData)
      .flatMap((club) => Object.values(club))
      .filter((eventItem) => {
        const eventName = eventItem.EventName?.trim().toLowerCase();
        return eventName?.startsWith(searchKeyWord);
      })
      .slice(0, 4);
  };

  const handleNameChange = (event) => {
    const searchedWord = event.target.value;
    setSearchedName(searchedWord);
    // Update focus state based on input content
    setIsNameFocus(searchedWord.trim().length > 0);
  };

  const handleSuggestionClick = (eventName) => {
    setSearchedName(eventName);
    setIsNameFocus(false);
  };

  const searchHandler = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const searchedDate = dateRef.current.value;

    dispatch(
      uiActions.setSearchEventParams({
        searchedWord: searchedName,
        searchedDate,
        searchedEventCategories,
      })
    );

    if (searchedName || searchedDate || searchedEventCategories) {
      setClearFilter(true);
    }
    setIsSubmitting(false);
    setSearchedName("");
    dateRef.current.value = "";
    dispatch(uiActions.setSearchedEventCategories(null));
  };

  useEffect(() => {
    const starCountRef = ref(db, "/events-list");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      dispatch(eventsActions.replaceEventsNameData(data));
    });
  }, [db, dispatch, searchedName]);

  // Generate suggestions content
  let content = null;
  if (eventsNameData && searchedName.trim().length > 0 && isNameFocus) {
    const filteredEvents = filteredEventsByName(eventsNameData, searchedName);

    content =
      filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <div
            key={event.EventId}
            className={styles["suggestion-menu-item"]}
            onClick={() => handleSuggestionClick(event.EventName)}
          >
            <p>{event.EventName}</p>
          </div>
        ))
      ) : (
        <div className={styles["no-results"]}>No matching events found</div>
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
            placeholder={"Event Name"}
            name="clubName"
            autoComplete="off"
            onChange={handleNameChange}
            onFocus={() => {
              // Only show menu if there's existing text
              if (searchedName.trim().length > 0) {
                setIsNameFocus(true);
              }
            }}
            value={searchedName}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <img src={dateIcon} alt="date" />
          <span className={dateSelected ? styles.hideS : styles.showS}>
            Date
          </span>
          <input
            ref={dateRef}
            type="date"
            id="date"
            placeholder="Date"
            name="date"
            onChange={handleDateChange}
            className={dateSelected ? styles.showD : styles.hideD}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.cateSearch}>
          <img src={cateIcon} alt="categories" />
          <CustomSelectInput navEvents={true} disabled={isSubmitting} />
        </div>

        <div>
          {!clearFilter && <ColoredButton type="submit">Search</ColoredButton>}
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

export default NavEvents;
