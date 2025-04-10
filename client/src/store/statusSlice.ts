import { createSlice } from "@reduxjs/toolkit";
import type { Status } from "./type";

const initialState: Status = {
  collapsed: false,
  language: "",
  currentCrumbs: [],
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateCollapse: (state) => {
      state.collapsed = !state.collapsed;
    },
    switchLanguage: (state, action) => {
      console.log("state", state);
      console.log("action", action);
    },
    updateCrumbs: (state, action) => {
      // console.log("state", state);
      // console.log("action", action);
      const { payload } = action;
      state.currentCrumbs = payload;
    },
  },
});

export const { updateCollapse, switchLanguage, updateCrumbs } =
  statusSlice.actions;
export default statusSlice.reducer;
