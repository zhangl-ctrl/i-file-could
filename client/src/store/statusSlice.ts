import { createSlice } from "@reduxjs/toolkit";
import type { Status } from "./type";

const initialState: Status = {
  collapsed: false,
  language: "",
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
  },
});

export const { updateCollapse, switchLanguage } = statusSlice.actions;
export default statusSlice.reducer;
