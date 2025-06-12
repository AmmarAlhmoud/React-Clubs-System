import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggleModal: false,
  searchParams: null,
  searchEventParams: null,
  searchedCategories: null,
  searchedEventCategories: null,
  clearFilter: false,
  resetFilter: false,
  clearEventFilter: false,
  resetEventFilter: false,
  requestsList: null,
  clubsList: null,
  weeklyCalData: null,
  currentClubMGDashData: null,
  cMEventsList: null,
  currentEventReqStatusCM: null,
  currentPostReqStatusCM: null,
  currentPostEditReqStatusCM: null,
  currentEventEditReqStatusCM: null,
  currentClubEditReqStatusCM: null,
  allReqList: [],
  clubsListForCM: null,
  recentEventsData: null,
  sTEventsList: null,
  clubsListForSt: null,
  isCmDashLoading: false,
  isStDashLoading: false,
  reqBoxStatusData: null,
  statusModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    replaceClubsList(state, action) {
      if (action.payload !== null) {
        state.clubsList = action.payload;
      }
    },
    replaceClubsListForCM(state, action) {
      if (action.payload !== null) {
        state.clubsListForCM = action.payload;
      }
    },
    replaceClubsListForSt(state, action) {
      if (action.payload !== null) {
        state.clubsListForSt = action.payload;
      }
    },
    replaceRequestsList(state, action) {
      if (action.payload !== null) {
        state.requestsList = action.payload;
      }
    },
    toggleModal(state, action) {
      state.toggleModal = action.payload;
    },
    setSearchParams(state, action) {
      state.searchParams = action.payload;
    },
    setSearchEventParams(state, action) {
      state.searchEventParams = action.payload;
    },
    setSearchedCategories(state, action) {
      state.searchedCategories = action.payload;
    },
    setSearchedEventCategories(state, action) {
      state.searchedEventCategories = action.payload;
    },
    setClearFilter(state, action) {
      state.clearFilter = action.payload;
    },
    setClearEventFilter(state, action) {
      state.clearEventFilter = action.payload;
    },
    setResetFilter(state, action) {
      state.resetFilter = action.payload;
    },
    setResetEventFilter(state, action) {
      state.resetEventFilter = action.payload;
    },
    setWeeklyCalData(state, action) {
      state.weeklyCalData = action.payload;
    },
    setCurrentClubMGDashData(state, action) {
      state.currentClubMGDashData = action.payload;
    },
    setCMEventsList(state, action) {
      state.cMEventsList = action.payload;
    },
    setCurrentEventReqStatusCM(state, action) {
      state.currentEventReqStatusCM = action.payload;
    },
    setCurrentPostReqStatusCM(state, action) {
      state.currentPostReqStatusCM = action.payload;
    },
    setCurrentPostEditReqStatusCM(state, action) {
      state.currentPostEditReqStatusCM = action.payload;
    },
    setCurrentEventEditReqStatusCM(state, action) {
      state.currentEventEditReqStatusCM = action.payload;
    },
    setCurrentClubEditReqStatusCM(state, action) {
      state.currentClubEditReqStatusCM = action.payload;
    },
    setAllReqList(state, action) {
      state.allReqList = action.payload;
    },
    setRecentEventsData(state, action) {
      state.recentEventsData = action.payload;
    },
    setSTEventsList(state, action) {
      state.sTEventsList = action.payload;
    },
    setIsCmDashLoading(state, action) {
      state.sTEventsList = action.payload;
    },
    setIsStDashLoading(state, action) {
      state.sTEventsList = action.payload;
    },
    setReqBoxStatusData(state, action) {
      state.reqBoxStatusData = action.payload;
    },
    setStatusModal(state, action) {
      state.statusModal = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
