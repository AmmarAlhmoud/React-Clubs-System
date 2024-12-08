import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import cateIcon from "../../assets/icons/ClubsList/categories.png";
import searchIcon from "../../assets/icons/ClubsList/search.png";
import ColoredButton from "./ColoredButton";
import CustomSelectInput from "./Search/CustomSelectInput";

import styles from "./NavClubs.module.css";

const NavClubs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const searchedCategories = useSelector(
    (state) => state.ui.searchedCategories
  );
  const inputRef = useRef();
  const dispatch = useDispatch();

  const resetFilterHandler = () => {
    setClearFilter(false);
    dispatch(uiActions.setResetFilter(true));
  };

  const searchHandler = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const searchedWord = inputRef.current.value;
    dispatch(uiActions.setSearchParams({ searchedWord, searchedCategories }));
    if (inputRef.current.value !== "" || searchedCategories !== null) {
      setClearFilter(true);
    }
    setIsSubmitting(false);
    // clear search inputs
    inputRef.current.value = "";
    dispatch(uiActions.setSearchedCategories(null));
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
        <div className={styles.cateSearch}>
          <img src={cateIcon} alt="categories" />
          <CustomSelectInput disabled={isSubmitting} />
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

export default NavClubs;
