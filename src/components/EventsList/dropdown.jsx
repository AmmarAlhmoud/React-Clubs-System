import { useDispatch, useSelector } from "react-redux";
import { eventsActions } from "../../store/events-slice";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const Dropdown = ({
  isEmpty,
  selectedCate,
  disabled,
  width,
  list,
  placeholder,
  identifier,
}) => {
  let selectedItems = [];
  const selectedSTime = useSelector(
    (state) => state.events.selectedStartingTime
  );
  const selectedETime = useSelector((state) => state.events.selectedEndingTime);
  const selectedLocation = useSelector(
    (state) => state.events.selectedLocation
  );
  const selectedType = useSelector((state) => state.events.selectedType);

  if (identifier === "starting-time") {
    selectedItems = selectedSTime;
  }

  if (identifier === "choosen-type") {
    selectedItems = selectedType;
  }

  if (identifier === "ending-time") {
    selectedItems = selectedETime;
  }

  if (identifier === "location") {
    selectedItems = selectedLocation;
  }

  const options = list;
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
    control: (styles) => ({
      ...styles,
      backgroundColor: "#1B1D21",

      border: `${
        isEmpty && selectedItems === null
          ? "2px solid red"
          : "2px solid #b2b4b7"
      }`,
      borderRadius: "0.5em",
      height: "auto",
      width: width,
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
        height: identifier === "choosen-type" ? "80px" : "150px",
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
    input: (styles) => {
      return {
        ...styles,
        color: "#fff",
      };
    },
    singleValue: (styles) => {
      return {
        ...styles,
        color: "#fff",
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
    if (identifier === "starting-time") {
      dispatch(eventsActions.setSelectedStartingTime(selected));
    }

    if (identifier === "ending-time") {
      dispatch(eventsActions.setSelectedEndingTime(selected));
    }

    if (identifier === "location") {
      dispatch(eventsActions.setSelectedLocation(selected));
    }
    if (identifier === "choosen-type") {
      dispatch(eventsActions.setSelectedType(selected));
    }
  };

  return (
    <>
      {identifier !== "location" && (
        <Select
          placeholder={placeholder}
          isDisabled={disabled}
          onChange={selectedItemsHandler}
          isSearchable
          options={options}
          styles={colorStyles}
          defaultValue={selectedCate}
        />
      )}
      {identifier === "location" && (
        <CreatableSelect
          formatCreateLabel={() => "Add a new location"}
          placeholder={placeholder}
          isDisabled={disabled}
          onChange={selectedItemsHandler}
          isSearchable
          options={options}
          styles={colorStyles}
          defaultValue={selectedCate}
        />
      )}
    </>
  );
};

export default Dropdown;
