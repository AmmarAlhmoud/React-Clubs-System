import { useDispatch, useSelector } from "react-redux";
import { clubActions } from "../../store/club-slice";
import Select from "react-select";

const SelectInput = ({ isEmpty, selectedCate, isNew, type, disabled }) => {
  const selectedItems = useSelector((state) => state.club.selectedCategories);
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
      backgroundColor: "#1B1D21",
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
        backgroundColor: "#1B1D21",
        color: "#fff",
        ":hover": {
          backgroundColor: "rgba(255, 255, 255,0.2)",
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
        backgroundColor: "#1B1D21",
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
    input: whiteColor,
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
    dispatch(clubActions.setSelectedCategories(selected));
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
      defaultValue={selectedCate}
    />
  );
};

export default SelectInput;
