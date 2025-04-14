import Koa from "koa";
import qiniu from "qiniu";
import { nanoid } from "nanoid";
import errorHttpCode from "../common/errorHttpCode";
import axios from "axios";
import {
  getCdnFlow,
  getTodaySpaceAmount,
  getSpaceFileAmount,
  getGetRequestAmount,
  getPutRequestAmount,
  getSpaceOutFlow,
} from "../api/qiniuServiceApi";

const default_expires = 3600;
/**
 * 根据【accessKey】、【secretKey】和【bucket】生成【token】，用于前端上传文件，【bucket】为每个存储桶的名称
 */
const generateQiniuToken = (
  accessKey: string,
  secretKey: string,
  bucket: string,
  expires: number
) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
    expires: expires || default_expires,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

const qiniuController = {
  // 获取 token
  async getToken(ctx: Koa.Context) {
    const { accessKey, secretKey, bucket, expires } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
      bucket: string;
      expires: number;
    };
    const token = await generateQiniuToken(
      accessKey,
      secretKey,
      bucket,
      expires
    );
    const tokenObj = {
      token,
      bucket,
      expires: expires || default_expires,
      ctime: new Date().getTime(),
    };
    ctx.body = {
      code: 200,
      success: true,
      message: "请求成功",
      data: tokenObj,
    };
  },
  // 获取存储桶列表
  async getBuckets(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    console.log("bucketManager", bucketManager);
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    let buckets: any[] = [];
    try {
      const bucketNames = await new Promise<string[]>((resolve, reject) => {
        bucketManager.listBucket((err, respBody, respInfo) => {
          if (err) return reject(err);
          resolve(respBody);
        });
      });
      await Promise.all(
        bucketNames.map(
          (bucket) =>
            new Promise((resolve, reject) => {
              bucketManager.getBucketInfo(bucket, async (err, respBody) => {
                if (err) {
                  return reject(err);
                }
                const domains = await bucketManager.listBucketDomains(bucket);
                const id = nanoid();
                const bucketItem = {
                  id,
                  bucketName: bucket,
                  bucketInfo: respBody,
                  cloudName: "七牛云",
                  cloudService: "qiniu",
                  region: respBody.region,
                  auth: respBody.private === 0 ? "公开" : "私有",
                  privateAuth: respBody.private,
                  domains: domains.data,
                };
                buckets.push(bucketItem);
                resolve(respBody);
              });
            })
        )
      );

      buckets = buckets.sort((a, b) => {
        if (a.bucketName > b.bucketName) {
          return 1;
        } else if (a.bucketName < b.bucketName) {
          return -1;
        } else {
          return 0;
        }
      });
      ctx.body = {
        code: 200,
        message: "成功获取存储桶列表",
        success: true,
        data: buckets,
      };
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: err.message,
        success: false,
        data: null,
      };
    }
  },
  // 根据存储桶获取文件列表
  async getFileList(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const { bucket } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
      bucket: string;
    };
    async function buildFileTree(prefix: string = "") {
      const options = {
        limit: 1000,
        delimiter: "/",
        prefix,
      };

      try {
        const { data } = await bucketManager.listPrefix(bucket, options);
        const { items, commonPrefixes } = data;
        const id = nanoid();

        const fileList: {
          id: string;
          name: string;
          files: any;
          folders: any;
        } = {
          id,
          name: prefix === "" ? "根目录" : prefix,
          files: items || [],
          folders: [],
        };

        if (commonPrefixes && commonPrefixes.length > 0) {
          await Promise.all(
            commonPrefixes.map(async (folder) => {
              const folderObj = await buildFileTree(folder);
              fileList.folders.push(folderObj);
            })
          );
        }
        return fileList;
      } catch (error) {
        return { name: prefix, files: [], folders: [] };
      }
    }

    async function main() {
      try {
        const fileTree = await buildFileTree();
        return {
          code: 200,
          success: true,
          message: "文件获取成功",
          data: fileTree,
        };
      } catch (error) {
        return {
          code: 201,
          success: false,
          message: "文件获取失败",
          data: null,
        };
      }
    }

    ctx.body = await main();
  },
  // 创建存储桶
  async createBucket(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const { bucket, regionId } = ctx.request.body as Record<string, any>;
    const options = {
      regionId,
    };
    const res = await bucketManager.createBucket(bucket, options);
    const { data, resp } = res;
    ctx.body = {
      code: resp.statusCode,
      success: resp.statusCode === 200 ? true : false,
      message: errorHttpCode[resp.statusCode!],
      data: data,
    };
  },
  // 删除存储桶
  async deleteBucket(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const { bucket } = ctx.request.body as Record<string, any>;
    const res = await bucketManager.deleteBucket(bucket);
    const { data, resp } = res;
    ctx.body = {
      code: resp.statusCode,
      success: resp.statusCode === 200 ? true : false,
      message: errorHttpCode[resp.statusCode!],
      data: data,
    };
  },
  // 获取文件详情
  async getFileDetail(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const { key, bucket, accessKey, secretKey } = ctx.request.body as Record<
      string,
      any
    >;
    const res = await bucketManager.stat(bucket, key);
    ctx.body = {
      code: 200,
      data: "lignhualuan",
    };
  },
  // 根据存储桶获取域名
  async getDomainsByBucket(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const { bucket } = ctx.request.body as Record<string, any>;
    try {
      const res = await bucketManager.listBucketDomains(bucket);
      const { data, resp } = res;
      ctx.body = {
        code: resp.statusCode,
        message: resp.statusMessage,
        success: true,
        data,
      };
    } catch (err: any) {
      console.error("Error: ", err.message);
    }
  },
  // 获取文件下载链接
  async getFileDownloadLink(ctx: Koa.Context) {
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    if (!bucketManager) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const { domain, key, auth } = ctx.request.body as Record<string, any>;
    // 0：公开，1：私有
    if (auth === 0) {
      const privateUrl = bucketManager.publicDownloadUrl(
        "http://" + domain,
        key
      );
      ctx.body = {
        code: 200,
        message: "请求成功",
        success: true,
        data: privateUrl,
      };
    } else {
      const deadline = parseInt(String(Date.now() / 1000)) + 3600;
      const privateUrl = bucketManager.privateDownloadUrl(
        "http://" + domain,
        key,
        deadline
      );
      ctx.body = {
        code: 200,
        message: "请求成功",
        success: true,
        data: privateUrl,
      };
    }
  },
  // 获取存储桶空间使用量数据
  async getSpaceOverview(ctx: Koa.Context) {
    const { accessKey, secretKey } = ctx.request.body as Record<string, any>;
    if (!accessKey || !secretKey) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const requestUrl =
      "https://uc.qiniuapi.com/v3/buckets?line=false&product=kodo&shared=true";
    const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
    const xQiniuDate =
      new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    try {
      const res = await axios.get(requestUrl, {
        headers: {
          Authorization: accessToken,
          "X-Qiniu-Date": xQiniuDate,
        },
      });
      ctx.body = {
        code: 200,
        success: true,
        message: "成功获取存储桶空间使用量数据",
        data: res.data,
      };
    } catch (err: any) {
      ctx.body = {
        code: err.status,
        success: false,
        message: "获取存储桶空间使用量数据失败",
        data: null,
      };
    }
  },
  // 获取使用趋势
  async getSpaceTendency(ctx: Koa.Context) {
    const { accessKey, secretKey, begin, end } = ctx.request.body as Record<
      string,
      any
    >;
    if (!accessKey || !secretKey) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const requestUrl = `http://api.qiniuapi.com/v6/space?begin=${begin}&end=${end}&g=day&disable_ctime=true&product=kodo&fogRegionsEnable=true`;
    const accessToken = qiniu.util.generateAccessToken(mac, requestUrl);
    const xQiniuDate =
      new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    try {
      const res = await axios.get(requestUrl, {
        headers: {
          Authorization: accessToken,
          "X-Qiniu-Date": xQiniuDate,
        },
      });
      ctx.body = {
        code: 200,
        success: true,
        message: "成功获取存储量趋势",
        data: res.data,
      };
    } catch (err: any) {
      ctx.body = {
        code: err.status,
        success: false,
        message: "获取存储量趋势失败",
        data: null,
      };
    }
  },
  // 获取标准存储今日空间存储量
  async getTodaySpaceAmount(ctx: Koa.Context) {
    const { accessKey, secretKey } = ctx.request.body as Record<string, any>;
    if (!accessKey || !secretKey) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        success: false,
        message: "认证授权失败",
        data: null,
      };
      return;
    }
    const response: Record<string, any> = {};
    try {
      const res1 = await getCdnFlow(accessKey, secretKey);
      const res2 = await getTodaySpaceAmount(accessKey, secretKey);
      const res3 = await getSpaceFileAmount(accessKey, secretKey);
      const res4 = await getGetRequestAmount(accessKey, secretKey);
      const res5 = await getPutRequestAmount(accessKey, secretKey);
      const res6 = await getSpaceOutFlow(accessKey, secretKey);
      response.cdnFlow = res1.data.reduce(
        (pre: any, cur: any) => pre + cur.values.flow,
        0
      );
      response.todaySpaceAmount = res2.data.datas[0];
      response.spaceFileAmount = res3.data.datas[0];
      response.getRequestAmount = res4.data.reduce(
        (pre: any, cur: any) => pre + cur.values.hits,
        0
      );
      response.putRequestAmount = res5.data.reduce(
        (pre: any, cur: any) => pre + cur.values.hits,
        0
      );
      response.spaceOutFlow = res6.data.reduce(
        (pre: any, cur: any) => pre + cur.values.flow,
        0
      );
      ctx.body = {
        code: 200,
        success: true,
        message: "获取空间存储桶概览数据成功",
        data: response,
      };
    } catch (err: any) {
      ctx.body = {
        code: err.status,
        success: false,
        message: err.message,
        data: null,
      };
    }
  },
};

export default qiniuController;
