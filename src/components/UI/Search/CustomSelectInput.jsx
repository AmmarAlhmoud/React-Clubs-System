import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import Select from "react-select";

const CustomSelectInput = ({ navEvents, disabled }) => {
  const searchedCategories = useSelector(
    (state) => state.ui.searchedCategories
  );
  const searchedEventCategories = useSelector(
    (state) => state.ui.searchedEventCategories
  );
  const options = [
    { label: "Science", value: "Science" },
    { label: "Humanities", value: "Humanities" },
    { label: "Business", value: "Business" },
    { label: "Math", value: "Math" },
    { label: "Visual", value: "Visual Arts" }, // Assuming "Visual" refers to Visual Arts
    { label: "Performing", value: "Performing Arts" }, // Assuming "Performing" refers to Performing Arts
    { label: "Writing", value: "Writing" },
    { label: "Media", value: "Media" },
    { label: "Games", value: "Games" },
    { label: "Culture", value: "Culture" },
    { label: "Lifestyle", value: "Lifestyle" },
    { label: "Hobbies", value: "Hobbies" },
    { label: "Activism", value: "Activism" },
    { label: "Service", value: "Service" },
    { label: "Faith", value: "Faith" },
    { label: "Individual", value: "Individual" },
    { label: "Team", value: "Team" },
    { label: "Fitness", value: "Fitness" },
    { label: "Outdoor", value: "Outdoor" },
    { label: "Technology", value: "Technology" },
  ];

  const whiteColor = (styles) => {
    return {
      ...styles,
      color: "#fff",
    };
  };

  const whiteColorWithHover = (styles) => {
    return {
      ...styles,
      color: "#fff",
      ":hover": {
        color: "rgba(255, 255, 255,80%)",
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
      backgroundColor: "#1B1D21",
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
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        columnGap: "0.8em",
        rowGap: "1em",
        backgroundColor: "#1B1D21",
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
        color: "#fff",
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
      return { ...styles, color: "#b2b4b7" };
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
      placeholder="Categories"
      isDisabled={disabled}
      onChange={selectedItemsHandler}
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
