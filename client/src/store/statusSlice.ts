import { createSlice } from "@reduxjs/toolkit";
import type { Status } from "./type";

const initialState: Status = {
  collapsed: false,
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateCollapse: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { updateCollapse } = statusSlice.actions;
export default statusSlice.reducer;
