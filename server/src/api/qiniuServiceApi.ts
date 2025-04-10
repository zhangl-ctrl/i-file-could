import axios from "axios";
import qiniu from "qiniu";
import dayjs from "dayjs";

// 获取存储空间今日存储量
export const getTodaySpaceAmount = async (
  accessKey: string,
  secretKey: string
) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const begin = dayjs().format("YYYYMMDD") + "000000";
  const end = dayjs().format("YYYYMMDD") + "235959";
  const requestUrl = `http://api.qiniuapi.com/v6/space?g=day&begin=${begin}&end=${end}&disable_ctime=true&product=kodo&fogRegionsEnable=true`;
  const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
  const xQiniuDate =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return axios.get(requestUrl, {
    headers: {
      Authorization: accessToken,
      "X-Qiniu-Date": xQiniuDate,
    },
  });
};

// 获取存储空间今日文件数
export const getSpaceFileAmount = async (
  accessKey: string,
  secretKey: string
) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const begin = dayjs().format("YYYYMMDD") + "000000";
  const end = dayjs().format("YYYYMMDD") + "235959";
  const requestUrl = `http://api.qiniuapi.com/v6/count?g=day&begin=${begin}&end=${end}&disable_ctime=true&product=kodo&fogRegionsEnable=true`;
  const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
  const xQiniuDate =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return axios.get(requestUrl, {
    headers: {
      Authorization: accessToken,
      "X-Qiniu-Date": xQiniuDate,
    },
  });
};

// 获取本月 API 请求次数（GET）
export const getGetRequestAmount = (accessKey: string, secretKey: string) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const now = dayjs();
  const begin = now.startOf("month").format("YYYYMMDD") + "000000";
  const end = now.endOf("month").format("YYYYMMDD") + "235959";
  const requestUrl = `http://api.qiniuapi.com/v6/blob_io?$metric=hits&$ftype=0&g=day&select=hits&begin=${begin}&end=${end}&disable_ctime=true&$product=kodo&fogRegionsEnable=true`;
  const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
  const xQiniuDate =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return axios.get(requestUrl, {
    headers: {
      Authorization: accessToken,
      "X-Qiniu-Date": xQiniuDate,
    },
  });
};

// 获取本月 API 请求次数（PUT）
export const getPutRequestAmount = (accessKey: string, secretKey: string) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const now = dayjs();
  const begin = now.startOf("month").format("YYYYMMDD") + "000000";
  const end = now.endOf("month").format("YYYYMMDD") + "235959";
  const requestUrl = `http://api.qiniuapi.com/v6/rs_put?$ftype=0&g=day&select=hits&begin=${begin}&end=${end}&disable_ctime=true&$product=kodo&fogRegionsEnable=true`;
  const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
  const xQiniuDate =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return axios.get(requestUrl, {
    headers: {
      Authorization: accessToken,
      "X-Qiniu-Date": xQiniuDate,
    },
  });
};

// 获取本月空间 CDN 回源流量
export const getCdnFlow = (accessKey: string, secretKey: string) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const now = dayjs();
  const begin = now.startOf("month").format("YYYYMMDD") + "000000";
  const end = now.endOf("month").format("YYYYMMDD") + "235959";
  const requestUrl = `http://api.qiniuapi.com/v6/blob_io?$metric=cdn_flow_out&$ftype=0&g=day&select=flow&begin=${begin}&end=${end}&disable_ctime=true&$product=kodo&fogRegionsEnable=true`;
  const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
  const xQiniuDate =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return axios.get(requestUrl, {
    headers: {
      Authorization: accessToken,
      "X-Qiniu-Date": xQiniuDate,
    },
  });
};

// 获取本月空间流出流量
export const getSpaceOutFlow = (accessKey: string, secretKey: string) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const now = dayjs();
  const begin = now.startOf("month").format("YYYYMMDD") + "000000";
  const end = now.endOf("month").format("YYYYMMDD") + "235959";
  const requestUrl = `http://api.qiniuapi.com/v6/blob_io?$metric=flow_out&$ftype=0&g=day&select=flow&begin=${begin}&end=${end}&disable_ctime=true&$product=kodo&fogRegionsEnable=true`;
  const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
  const xQiniuDate =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return axios.get(requestUrl, {
    headers: {
      Authorization: accessToken,
      "X-Qiniu-Date": xQiniuDate,
    },
  });
};
