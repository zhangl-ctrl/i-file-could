import Koa from "koa";
import qiniu from "qiniu";
import { bucketTokens } from "./type";
import { nanoid } from "nanoid";
import errorHttpCode from "../common/errorHttpCode";
import getBucketManager from "../utils/getBucketManager";

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
        message: "请求成功",
        success: true,
        data: buckets,
      };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: err };
    }
  },
  // 根据存储桶获取文件列表
  async getFileList(ctx: Koa.Context) {
    const { bucket } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
      bucket: string;
    };
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
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
    const { bucket, regionId, auth } = ctx.request.body as Record<string, any>;
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
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
    const { bucket } = ctx.request.body as Record<string, any>;
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
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
    const { key, bucket, accessKey, secretKey } = ctx.request.body as Record<
      string,
      any
    >;
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
    const res = await bucketManager.stat(bucket, key);
    ctx.body = {
      code: 200,
      data: "lignhualuan",
    };
  },
  // 根据存储桶获取域名
  async getDomainsByBucket(ctx: Koa.Context) {
    const { bucket } = ctx.request.body as Record<string, any>;
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;
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
    const { domain, key, auth } = ctx.request.body as Record<string, any>;
    const bucketManager: qiniu.rs.BucketManager = ctx.bucketManager;

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
};

export default qiniuController;
