import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clubsList: null,
  newClub: null,
  selectedCategories: [],
  currentClubInfo: {},
  currentClubInfoEvent: {},
  currentUserClubInfo: null,
  editOldClubInfo: {},
  editNewClubInfo: {},
  editedClub: null,
  updatedClubInfo: null,
  reqClubStatus: null,
  reqEditClub: null,
  deletedClub: null,
  createdManager: null,
  reqClubEditList: null,
  rejectClubEditingReq: null,
  submittingName: null,
  deletedPost: null,
  deletedEvent: null,
  reqEditPost: null,
  reqEditPostsList: null,
  reqEditPostData: null,
  reqEditPostStatus: null,
  rejectEditPostStatus: null,
  showEditPostDetails: false,
  currentEditPostDetails: null,
  currentPost: null,
  reqEditEvent: null,
  currentClubEventsNum: 0,
  reqEditEventsList: null,
  reqEditedEventData: null,
  showEditedEventDetails: false,
  rejectEditedEventStatus: null,
  reqEditEventStatus: null,
  currentEditedEventDetails: null,
  currentEvent: null,
};

const clubSlice = createSlice({
  name: "club",
  initialState,
  reducers: {
    replaceClubsList(state, action) {
      if (action.payload !== null) {
        state.clubsList = action.payload;
      }
    },
    addNewClub(state, action) {
      if (action !== null) {
        state.newClub = action.payload;
      } else {
        state.newClub = {};
      }
    },
    addEditedClub(state, action) {
      if (action !== null) {
        state.editedClub = action.payload;
      } else {
        state.editedClub = {};
      }
    },
    setReqClubStatus(state, action) {
      if (action !== null) {
        state.reqClubStatus = action.payload;
      } else {
        state.reqClubStatus = {};
      }
    },
    setReqEditClub(state, action) {
      if (action !== null) {
        state.reqEditClub = action.payload;
      } else {
        state.reqEditClub = {};
      }
    },
    setReqEditPost(state, action) {
      if (action !== null) {
        state.reqEditPost = action.payload;
      } else {
        state.reqEditPost = {};
      }
    },

    rejectClubEditingReq(state, action) {
      if (action !== null) {
        state.rejectClubEditingReq = action.payload;
      } else {
        state.rejectClubEditingReq = {};
      }
    },
    addDeletedClub(state, action) {
      if (action !== null) {
        state.deletedClub = action.payload;
      } else {
        state.deletedClub = {};
      }
    },
    setSelectedCategories(state, action) {
      state.selectedCategories = action.payload;
    },
    setCurrentClubInfo(state, action) {
      state.currentClubInfo = action.payload;
    },
    setCurrentClubInfoEvnet(state, action) {
      state.currentClubInfoEvent = action.payload;
    },
    setEditOldClubInfo(state, action) {
      state.editOldClubInfo = action.payload;
    },
    setEditNewClubInfo(state, action) {
      state.editNewClubInfo = action.payload;
    },
    setCurrentUserClubInfo(state, action) {
      state.currentUserClubInfo = action.payload;
    },
    setCreatedManager(state, action) {
      state.createdManager = action.payload;
    },
    setReqClubEditList(state, action) {
      state.reqClubEditList = action.payload;
    },
    setUpdatedClubInfo(state, action) {
      state.updatedClubInfo = action.payload;
    },
    setSubmittingName(state, action) {
      state.submittingName = action.payload;
    },
    setDeletedPost(state, action) {
      state.deletedPost = action.payload;
    },
    setDeletedEvent(state, action) {
      state.deletedEvent = action.payload;
    },
    setCurrentClubEventsNum(state, action) {
      state.currentClubEventsNum = action.payload;
    },
    setReqEditPostsList(state, action) {
      state.reqEditPostsList = action.payload;
    },
    setReqEditPostData(state, action) {
      state.reqEditPostData = action.payload;
    },
    setReqEditPostStatus(state, action) {
      state.reqEditPostStatus = action.payload;
    },
    setRejectEditPostStatus(state, action) {
      state.rejectEditPostStatus = action.payload;
    },
    setShowEditPostDetails(state, action) {
      state.showEditPostDetails = action.payload;
    },
    setCurrentEditPostDetails(state, action) {
      state.currentEditPostDetails = action.payload;
    },
    setCurrentPost(state, action) {
      state.currentPost = action.payload;
    },
    setReqEditEvent(state, action) {
      state.reqEditEvent = action.payload;
    },
    setReqEditEventsList(state, action) {
      state.reqEditEventsList = action.payload;
    },
    setReqEditedEventData(state, action) {
      state.reqEditedEventData = action.payload;
    },
    setShowEditedEventDetails(state, action) {
      state.showEditedEventDetails = action.payload;
    },
    setRejectEditedEventStatus(state, action) {
      state.rejectEditedEventStatus = action.payload;
    },
    setReqEditEventStatus(state, action) {
      state.reqEditEventStatus = action.payload;
    },

    setCurrentEditedEventDetails(state, action) {
      state.currentEditedEventDetails = action.payload;
    },
    setCurrentEvent(state, action) {
      state.currentEvent = action.payload;
    },
  },
});

export const clubActions = clubSlice.actions;
export default clubSlice.reducer;
