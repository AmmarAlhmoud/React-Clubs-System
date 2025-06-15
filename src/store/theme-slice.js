// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lightMode: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.lightMode = !state.lightMode;
    },
    setLight: (state, action) => {
      state.lightMode = action.payload;
    },
  },
});

export const { toggleTheme, setLight } = themeSlice.actions;
export default themeSlice.reducer;
