import { combineReducers } from "@reduxjs/toolkit";
import statusSlice from "./statusSlice";

export default combineReducers({
  status: statusSlice,
});
