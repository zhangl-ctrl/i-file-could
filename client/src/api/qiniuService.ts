import http from "@/utils/http";
import { Token } from "./type";

// 获取七牛云 token
export const getQiniuToken = (
  accessKey: string,
  secretKey: string,
  bucket: string | Array<string>
): Promise<Token> => {
  return http.post(
    "/qiniu/getQiniuToken",
    {
      accessKey,
      secretKey,
      bucket,
    },
    {
      headers: {
        event: encodeURIComponent("获取存储桶 token"),
      },
    }
  );
};
// 获取七牛云存储桶列表
export const getQiniuBuckets = (accessKey: string, secretKey: string) => {
  return http.post(
    "/qiniu/getQiniuBuckets",
    {
      accessKey,
      secretKey,
    },
    {
      headers: {
        event: encodeURIComponent("获取存储桶列表"),
      },
    }
  );
};
// 根据七牛云存储桶获取桶内文件
export const getQiniuFilelist = (
  accessKey: string,
  secretKey: string,
  bucket: string
) => {
  return http.post(
    "/qiniu/getQiniuFilelist",
    {
      accessKey,
      secretKey,
      bucket,
    },
    {
      headers: {
        event: encodeURIComponent("获取文件列表"),
      },
    }
  );
};
// 新建存储桶
export const createQiniuBucket = (
  accessKey: string,
  secretKey: string,
  bucket: string,
  regionId: string,
  auth: number | string
) => {
  return http.post(
    "/qiniu/createBucket",
    {
      accessKey,
      secretKey,
      bucket,
      regionId,
      auth,
    },
    {
      headers: {
        event: encodeURIComponent("新建存储桶"),
      },
    }
  );
};
// 删除存储桶
export const deleteQiniuBucket = (
  accessKey: string,
  secretKey: string,
  bucket: string
) => {
  return http.post(
    "/qiniu/deleteBucket",
    {
      accessKey,
      secretKey,
      bucket,
    },
    {
      headers: {
        event: encodeURIComponent("删除存储桶"),
      },
    }
  );
};
// 获取文件详情
export const getQiniuFileDetail = (
  accessKey: string,
  secretKey: string,
  bucket: string,
  key: string
) => {
  return http.post(
    "/qiniu/getFileDetail",
    {
      accessKey,
      secretKey,
      bucket,
      key,
    },
    {
      headers: {
        event: encodeURIComponent("获取文件详情"),
      },
    }
  );
};
// 获取文件下载链接
export const getFileDownloadLink = (
  accessKey: string,
  secretKey: string,
  domain: string,
  key: string,
  auth: number
) => {
  return http.post(
    "/qiniu/getFileDownloadLink",
    {
      accessKey,
      secretKey,
      domain,
      key,
      auth,
    },
    {
      headers: {
        event: encodeURIComponent("获取文件下载链接"),
      },
    }
  );
};

// 获取存储桶空间使用量
export const getSpaceOverview = (accessKey: string, secretKey: string) => {
  return http.post(
    "/qiniu/getSpaceOverview",
    {
      accessKey,
      secretKey,
    },
    {
      headers: {
        event: encodeURIComponent("获取存储桶空间使用量"),
      },
    }
  );
};

// 获取使用趋势
export const getSpaceTendency = (
  accessKey: string,
  secretKey: string,
  begin?: string,
  end?: string
) => {
  return http.post(
    "/qiniu/getSpaceTendency",
    {
      accessKey,
      secretKey,
      begin,
      end,
    },
    {
      headers: {
        event: encodeURIComponent("获取使用趋势"),
      },
    }
  );
};

// 获取标准存储桶空间概览数据
export const getTodaySpaceOverView = (accessKey: string, secretKey: string) => {
  return http.post(
    "/qiniu/getTodaySpaceAmount",
    {
      accessKey,
      secretKey,
    },
    {
      headers: {
        event: encodeURIComponent("获取标准存储今日空间存储量"),
      },
    }
  );
};
