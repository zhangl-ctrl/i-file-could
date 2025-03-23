import { combineReducers } from "@reduxjs/toolkit";
import statusSlice from "./statusSlice";
import cloudServiceSlice from "./cloudServiceSlice";

export default combineReducers({
  status: statusSlice,
  cloudService: cloudServiceSlice,
});
