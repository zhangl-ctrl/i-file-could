import http from "@/utils/http";
import { Token } from "./type";

// 获取七牛云 token
export const getQiniuToken = (
  accessKey: string,
  secretKey: string,
  bucket: string | Array<string>
): Promise<Token> => {
  return http.post("/qiniu/getQiniuToken", {
    accessKey,
    secretKey,
    bucket,
  });
};
// 获取七牛云存储桶
export const getQiniuBuckets = (accessKey: string, secretKey: string) => {
  return http.post("/qiniu/getQiniuBuckets", {
    accessKey,
    secretKey,
  });
};
// 根据七牛云存储桶获取桶内文件
export const getQiniuFilelist = (
  accessKey: string,
  secretKey: string,
  bucket: string
) => {
  return http.post("/qiniu/getQiniuFilelist", {
    accessKey,
    secretKey,
    bucket,
  });
};
// 新建七牛云存储桶
export const createQiniuBucket = (
  accessKey: string,
  secretKey: string,
  bucket: string,
  regionId: string,
  auth: number | string
) => {
  return http.post("/qiniu/createBucket", {
    accessKey,
    secretKey,
    bucket,
    regionId,
    auth,
  });
};
// 删除存储桶
export const deleteQiniuBucket = (
  accessKey: string,
  secretKey: string,
  bucket: string
) => {
  return http.post("/qiniu/deleteBucket", {
    accessKey,
    secretKey,
    bucket,
  });
};
// 获取文件详情
export const getQiniuFileDetail = (
  accessKey: string,
  secretKey: string,
  bucket: string,
  key: string
) => {
  return http.post("/qiniu/getFileDetail", {
    accessKey,
    secretKey,
    bucket,
    key,
  });
};
// 获取文件下载链接
export const getFileDownloadLink = (
  accessKey: string,
  secretKey: string,
  domain: string,
  key: string,
  auth: number
) => {
  return http.post("/qiniu/getFileDownloadLink", {
    accessKey,
    secretKey,
    domain,
    key,
    auth,
  });
};
