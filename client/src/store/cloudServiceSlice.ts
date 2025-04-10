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
    // 设置七牛秘钥
    setQiniuServiceKey: (state, action) => {
      const {
        payload: { accessKey, secretKey },
      } = action;
      state.qiniuService.accessKey = accessKey;
      state.qiniuService.secretKey = secretKey;
    },
    // 设置七牛token，每个存储桶对应一个token
    setQiniuToken: (state, action) => {
      const { bucketName, token } = action.payload;
      state.qiniuService.bucketTokens[bucketName] = token;
    },
    // 设置七牛云存储桶
    setQiniuBuckets: (state, action) => {
      state.qiniuService.buckets = action.payload;
    },
  },
});

export const { setQiniuServiceKey, setQiniuToken, setQiniuBuckets } =
  cloudServiceSlice.actions;
export default cloudServiceSlice.reducer;
