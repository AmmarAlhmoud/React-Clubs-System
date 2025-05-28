import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventsActions } from "../../store/events-slice";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import "./DateInput.css";

const DateInput = ({ disabled, isEmpty, startTyping }) => {
  const [selectedDate, setSelectedDate] = useState();
  const afterSelection = useSelector((state) => state.events.selectedDate);
  const dispatch = useDispatch();

  const customeStyles = {
    id: "date-input",
    dayPlaceholder: "dd",
    monthPlaceholder: "mm",
    yearPlaceholder: "yyyy",
  };

  useEffect(() => {
    if (selectedDate) {
      const date = selectedDate.toISOString();
      dispatch(eventsActions.setSelectedDate(date));
    }
  }, [dispatch, selectedDate]);

  return (
    <DatePicker
      className={`container ${
        isEmpty && afterSelection.length === 0 && startTyping ? "isEmpty" : ""
      }`}
      onChange={setSelectedDate}
      value={selectedDate}
      disabled={disabled}
      {...customeStyles}
    />
  );
};

export default DateInput;
