import http from "@/utils/http";
import { Token } from "./type";

// const accessKey = "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5";
// const secretKey = "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz";
// const bucket = "zl-picture-01";

// 获取七牛云 token
export const getQiniuToken = (
  accessKey: string,
  secretKey: string
  // bucket: string
): Promise<Token> => {
  return http.post("/qiniu/getToken", {
    accessKey,
    secretKey,
    // bucket,
  });
};
// 获取七牛云存储桶
export const getQiniuBuckets = (accessKey: string, secretKey: string) => {
  return http.post("/qiniu/getBuckets", {
    accessKey,
    secretKey,
  });
};
