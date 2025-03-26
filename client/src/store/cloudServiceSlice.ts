import { createSlice } from "@reduxjs/toolkit";
import { Cloud } from "./type";

const initialState: Cloud = {
  qiniuService: {
    accessKey: "",
    secretKey: "",
    token: "",
    buckets: [],
    bucketTokens: {},
  },
  tencentService: {
    accessKey: "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5",
    secretKey: "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz",
    token: "",
  },
};

const cloudServiceSlice = createSlice({
  name: "cloudServiceSlice",
  initialState,
  reducers: {
    setQiniuServiceKey: (state, action) => {
      const {
        payload: { accessKey, secretKey },
      } = action;
      state.qiniuService.accessKey = accessKey;
      state.qiniuService.secretKey = secretKey;
    },
    setQiniuToken: (state, action) => {
      const { payload } = action;
      state.qiniuService.token = payload;
    },
    setQiniuBuckets: (state, action) => {
      state.qiniuService.buckets = action.payload;
    },
  },
});

export const { setQiniuServiceKey, setQiniuToken, setQiniuBuckets } =
  cloudServiceSlice.actions;
export default cloudServiceSlice.reducer;
