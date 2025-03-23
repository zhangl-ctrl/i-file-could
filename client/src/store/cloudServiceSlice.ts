import { createSlice } from "@reduxjs/toolkit";
import { Cloud } from "./type";

const initialState: Cloud = {
  qiniuService: {
    accessKey: "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5",
    secretKey: "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz",
  },
  tencentService: {
    accessKey: "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5",
    secretKey: "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz",
  },
};

const cloudServiceSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setServiceKey: (state, action) => {
      const {
        payload: { accessKey, secretKey },
      } = action;
      state.qiniuService.accessKey = accessKey;
      state.qiniuService.secretKey = secretKey;
    },
  },
});

export const { setServiceKey } = cloudServiceSlice.actions;
export default cloudServiceSlice.reducer;
