import { useDispatch, useSelector } from "react-redux";
import { clubActions } from "../../store/club-slice";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const SelectInput = ({ isEmpty, selectedCate, isNew, type, disabled }) => {
  const { t } = useTranslation();

  const selectedItems = useSelector((state) => state.club.selectedCategories);
  const lightModetheme = useSelector((state) => state.theme.lightMode);

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
      color: lightModetheme ? "black" : "#fff",
    };
  };

  const whiteColorWithHover = (styles) => {
    return {
      ...styles,
      color: lightModetheme ? "black" : "#fff",
      ":hover": {
        color: lightModetheme ? "rgba(0, 0, 0,50%)" : "rgba(255, 255, 255,80%)",
      },
    };
  };

  let borderColor = "2px solid #b2b4b7";
  if (
    (isEmpty && selectedItems.length === 0) ||
    (isEmpty && selectedCate?.length === 0)
  ) {
    borderColor = "2px solid red";
  }
  if (isNew && type === "new-info") {
    borderColor = "2px solid #6ac47f";
  }

  const colorStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: lightModetheme ? "#fff" : "#1B1D21",
      border: borderColor,
      borderRadius: "0.5em",
      height: "auto",
      width: 400,
      ":hover": {
        border: "2px solid #b2b4b7",
      },
      boxShadow: "none",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: lightModetheme ? "#fff" : "#1B1D21",
        color: lightModetheme ? "black" : "#fff",
        ":hover": {
          backgroundColor: lightModetheme
            ? "rgba(0, 0, 0,50%)"
            : "rgba(255, 255, 255,0.2)",
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
        backgroundColor: "#6AC47F",
        borderRadius: "0.8em",
        color: "#fff",
        padding: "0.2em",
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
        backgroundColor: lightModetheme ? "#fff" : "#1B1D21",
        height: "150px",
        "&::-webkit-scrollbar": {
          backgroundColor: "rgb(255, 255, 255, 0.1)",
          width: "5px",
          height: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d9d9d9",
          borderRadius: "10px",
        },
      };
    },
    singleValue: (styles) => {
      return {
        ...styles,
        color: lightModetheme ? "black" : "#fff",
        fontSize: "0.9rem",
      };
    },
    input: whiteColor,
    multiValueLabel: whiteColor,
    dropdownIndicator: whiteColorWithHover,
    loadingIndicator: whiteColor,
    indicatorSeparator: whiteColor,
    clearIndicator: whiteColorWithHover,
    noOptionsMessage: whiteColor,
    placeholder: (styles) => {
      return { ...styles, color: "#b2b4b7", fontSize: "0.9rem" };
    },
  };

  const dispatch = useDispatch();

  const selectedItemsHandler = (selected) => {
    dispatch(clubActions.setSelectedCategories(selected));
  };

  return (
    <Select
      placeholder={t("clubs-list.club-card.club-edit-req.cate")}
      isDisabled={disabled}
      onChange={selectedItemsHandler}
      isSearchable
      options={options}
      isMulti
      styles={colorStyles}
      defaultValue={selectedCate}
    />
  );
};

export default SelectInput;
