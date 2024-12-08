import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import cateIcon from "../../assets/icons/ClubsList/categories.png";
import searchIcon from "../../assets/icons/ClubsList/search.png";
import dateIcon from "../../assets/icons/EventsList/date.png";
import ColoredButton from "./ColoredButton";

import styles from "./NavEvents.module.css";
import CustomSelectInput from "./Search/CustomSelectInput";

const NavEvents = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const searchedEventCategories = useSelector(
    (state) => state.ui.searchedEventCategories
  );
  const [dateSelected, setDateSelected] = useState(false);

  const dispatch = useDispatch();
  const inputRef = useRef();
  const dateRef = useRef();

  const handleDateChange = () => {
    setDateSelected(true);
  };

  const resetFilterHandler = () => {
    setClearFilter(false);
    dispatch(uiActions.setResetEventFilter(true));
  };

  const searchHandler = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const searchedWord = inputRef.current.value;
    const searchedDate = dateRef.current.value;

    dispatch(
      uiActions.setSearchEventParams({
        searchedWord,
        searchedDate,
        searchedEventCategories,
      })
    );

    if (
      inputRef.current.value !== "" ||
      dateRef.current.value !== "" ||
      searchedEventCategories !== null
    ) {
      setClearFilter(true);
    }
    setIsSubmitting(false);
    // clear search inputs
    inputRef.current.value = "";
    dateRef.current.value = "";
    dispatch(uiActions.setSearchedEventCategories(null));
  };

  return (
    <form onSubmit={searchHandler}>
      <nav className={styles.nav}>
        <div>
          <img src={searchIcon} alt="search" />
          <input
            type="text"
            ref={inputRef}
            placeholder="Club Name"
            name="clubName"
            autoComplete="off"
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
