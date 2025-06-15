// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  lang: "en",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    setLang: (state, action) => {
      state.lang = action.payload;
    },
    toggleLang: (state) => {
      state.lang = state.lang === "en" ? "tr" : "en";
    },
  },
});

export const { setTheme, toggleTheme, setLang, toggleLang } =
  themeSlice.actions;
export default themeSlice.reducer;
