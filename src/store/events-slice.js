import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventsList: null,
  currentEventDetails: {},
  currentPostDetails: {},
  showEventDetails: false,
  showPostDetails: false,
  newEvent: null,
  newPost: null,
  selectedDate: "",
  selectedStartingTime: null,
  selectedEndingTime: null,
  selectedLocation: null,
  reqEventsList: null,
  reqPostsList: null,
  reqPostStatus: null,
  reqPostData: null,
  rejectPostStatus: null,
  reqEventData: null,
  reqEventStatus: null,
  rejectEventStatus: null,
  fetchedListOfUsers: null,
  deletedEvent: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    replaceEventsData(state, action) {
      if (action.payload !== null) {
        state.eventsList = action.payload;
      }
    },
    setCurrentEventDetails(state, action) {
      if (action !== null) {
        state.currentEventDetails = action.payload;
      } else {
        state.currentEventDetails = {};
      }
    },
    setCurrentPostDetails(state, action) {
      if (action !== null) {
        state.currentPostDetails = action.payload;
      } else {
        state.currentPostDetails = {};
      }
    },
    setShowEventDetails(state, action) {
      state.showEventDetails = action.payload;
    },
    setShowPostDetails(state, action) {
      state.showPostDetails = action.payload;
    },
    addDeletedEvent(state, action) {
      if (action !== null) {
        state.deletedEvent = action.payload;
      } else {
        state.deletedEvent = {};
      }
    },
    addNewEvent(state, action) {
      if (action !== null) {
        state.newEvent = action.payload;
      } else {
        state.newEvent = {};
      }
    },
    addNewPost(state, action) {
      if (action !== null) {
        state.newPost = action.payload;
      } else {
        state.newPost = {};
      }
    },
    setSelectedStartingTime(state, action) {
      state.selectedStartingTime = action.payload;
    },
    setSelectedEndingTime(state, action) {
      state.selectedEndingTime = action.payload;
    },
    setSelectedLocation(state, action) {
      state.selectedLocation = action.payload;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    setReqEventsList(state, action) {
      state.reqEventsList = action.payload;
    },
    setReqPostsList(state, action) {
      state.reqPostsList = action.payload;
    },
    setReqPostStatus(state, action) {
      state.reqPostStatus = action.payload;
    },
    setReqPostData(state, action) {
      state.reqPostData = action.payload;
    },
    setRejectPostStatus(state, action) {
      state.rejectPostStatus = action.payload;
    },
    setReqEventData(state, action) {
      state.reqEventData = action.payload;
    },
    setReqEventStatus(state, action) {
      state.reqEventStatus = action.payload;
    },
    setRejectEventStatus(state, action) {
      state.rejectEventStatus = action.payload;
    },
    setFetchedListOfUsers(state, action) {
      state.fetchedListOfUsers = action.payload;
    },
  },
});

export const eventsActions = eventsSlice.actions;

export default eventsSlice.reducer;
