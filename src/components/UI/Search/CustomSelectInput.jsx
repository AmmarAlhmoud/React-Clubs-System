import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const CustomSelectInput = ({ navEvents, disabled }) => {
  const { t } = useTranslation();
  const mode = useSelector((state) => state.theme.mode);

  const searchedCategories = useSelector(
    (state) => state.ui.searchedCategories
  );
  const searchedEventCategories = useSelector(
    (state) => state.ui.searchedEventCategories
  );
  const [isFocused, setIsFocused] = useState(false);
  const options = [
    {
      label: t("cate-list-label.0"),
      value: "science",
    },
    {
      label: t("cate-list-label.1"),
      value: "humanities",
    },
    {
      label: t("cate-list-label.2"),
      value: "business",
    },
    {
      label: t("cate-list-label.3"),
      value: "math",
    },
    {
      label: t("cate-list-label.4"),
      value: "visual-arts",
    },
    {
      label: t("cate-list-label.5"),
      value: "performing-arts",
    },
    {
      label: t("cate-list-label.6"),
      value: "writing",
    },
    {
      label: t("cate-list-label.7"),
      value: "media",
    },
    {
      label: t("cate-list-label.8"),
      value: "games",
    },
    {
      label: t("cate-list-label.9"),
      value: "culture",
    },
    {
      label: t("cate-list-label.10"),
      value: "lifestyle",
    },
    {
      label: t("cate-list-label.11"),
      value: "hobbies",
    },
    {
      label: t("cate-list-label.12"),
      value: "activism",
    },
    {
      label: t("cate-list-label.13"),
      value: "service",
    },
    {
      label: t("cate-list-label.14"),
      value: "faith",
    },
    {
      label: t("cate-list-label.15"),
      value: "individual",
    },
    {
      label: t("cate-list-label.16"),
      value: "team",
    },
    {
      label: t("cate-list-label.17"),
      value: "fitness",
    },
    {
      label: t("cate-list-label.18"),
      value: "outdoor",
    },
    {
      label: t("cate-list-label.19"),
      value: "technology",
    },
  ];

  const whiteColor = (styles) => {
    return {
      ...styles,
      color: mode === "light" ? "black" : "#fff",
    };
  };

  const whiteColorWithHover = (styles) => {
    return {
      ...styles,
      color: mode === "light" ? "black" : "#fff",
      ":hover": {
        color:
          mode === "light" ? "rgba(0, 0, 0,50%)" : "rgba(255, 255, 255,80%)",
      },
    };
  };

  const colorStyles = {
    valueContainer: (styles) => {
      return {
        ...styles,
        display: "flex",
        flexDirection: "row",
        wrap: "nowrap",
        position: "relative",
        maxHeight: 34,
        width: navEvents ? 330 : 480,
        maxWidth: navEvents ? 330 : 480,
        overFlowY: "scroll",
      };
    },
    control: (styles) => ({
      ...styles,
      position: "relative",
      backgroundColor: mode === "light" ? "#fff" : "#1B1D21",
      width: navEvents ? 330 : 480,
      maxWidth: navEvents ? 330 : 480,
      overFlowX: "scroll",
      border: "none",
      boxShadow: "none",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected ? "#7c787e" : "#6AC47F",
        borderRadius: "1.1em",
        padding: "0.2em 1em 0.2em 1em",
        width: "fit-content",
        height: "fit-content",
        color: isSelected ? "#312f30" : "#fff",
        cursor: isSelected ? "not-allowed" : "pointer",
        border: "none",
        ":hover": {
          outline: isSelected ? "" : "2px solid #ab4d7d",
          backgroundColor: isSelected ? "" : "#1B1D21",
          color: isSelected ? "" : "#ab4d7d",
        },
        ":focus": {
          border: "none",
          outline: "none",
        },
      };
    },
    multiValue: (styles) => {
      return {
        ...styles,
        display: "flex",
        backgroundColor: "#6AC47F",
        borderRadius: "0.8em",
        color: "#fff",
        padding: "0.2em",
        maxHeight: "50px",
        maxWidth: 448,
        overFlow: "auto",
        fontSize: "0.85rem",
      };
    },
    multiValueRemove: (styles) => {
      return {
        ...styles,
        color: "#fff",
        cursor: "pointer",
        ":hover": {
          backgroundColor: "rgba(255, 255, 255,0.2)",
        },
      };
    },
    menuList: (styles) => {
      return {
        ...styles,
        border: mode === "light" ? "2px solid black" : "1px solid white",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        columnGap: "0.8em",
        rowGap: "1em",
        backgroundColor: mode === "light" ? "#fff" : "#1B1D21",
        borderRadius: "1em",
        position: "absolute",
        top: navEvents ? "50px" : "25px",
        left: navEvents ? "-1075px" : "-622px",
        height: "150px",
        width: "1245px",
        maxWidth: "1245px",
        padding: "2em 2em",
        "&::-webkit-scrollbar": {
          width: "5px",
          height: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#F23378",
          borderRadius: "10px",
        },
      };
    },
    input: (styles) => {
      return {
        ...styles,
        color: mode === "light" ? "black" : "#fff",
        fontWeight: "bold",
        maxHeight: "20px",
      };
    },
    multiValueLabel: whiteColor,
    dropdownIndicator: whiteColorWithHover,
    loadingIndicator: whiteColor,
    indicatorSeparator: whiteColor,
    clearIndicator: whiteColorWithHover,
    noOptionsMessage: whiteColor,
    placeholder: (styles) => {
      return {
        ...styles,
        color: "#b2b4b7",
        marginTop: "0.2em",
        fontSize: "1rem",
        fontWeight: "bold",
      };
    },
  };

  const dispatch = useDispatch();

  const selectedItemsHandler = (selected) => {
    if (!navEvents) {
      dispatch(uiActions.setSearchedCategories(selected));
    }
    if (navEvents) {
      dispatch(uiActions.setSearchedEventCategories(selected));
    }
  };

  return (
    <Select
      placeholder={
        isFocused ? "" : t("events-list.nav-events.categories-input.title")
      }
      isDisabled={disabled}
      onChange={selectedItemsHandler}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      isSearchable
      options={options}
      isMulti
      styles={colorStyles}
      hideSelectedOptions={false}
      value={navEvents ? searchedEventCategories : searchedCategories}
    />
  );
};

export default CustomSelectInput;
