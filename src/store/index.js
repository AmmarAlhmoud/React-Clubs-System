import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui-slice";
import imagesSlice from "./images-slice";
import eventsSlice from "./events-slice";
import clubSlice from "./club-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice,
    img: imagesSlice,
    events: eventsSlice,
    club: clubSlice,
  },
});

export default store;
