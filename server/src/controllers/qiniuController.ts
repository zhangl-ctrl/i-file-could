import Koa from "koa";
import qiniu from "qiniu";
import { nanoid } from "nanoid";
import { fileType } from "./type";

function getBucketManager(accessKey: string, secretKey: string) {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  return new qiniu.rs.BucketManager(mac, config);
}

/**
 * 根据【accessKey】、【secretKey】和【bucket】生成【token】，用于前端上传文件，【bucket】为每个存储桶的名称
 */
const generateQiniuToken = (
  accessKey: string,
  secretKey: string,
  bucket: string
) => {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
    expires: 7200,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

const qiniuController = {
  // 获取 token
  getToken: (ctx: Koa.Context) => {
    const { accessKey, secretKey, bucket } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
      bucket: string;
    };
    const token = generateQiniuToken(accessKey, secretKey, bucket);
    ctx.body = {
      code: 200,
      success: true,
      message: "请求成功",
      data: {
        token,
      },
    };
  },
  // 获取存储桶列表
  getBuckets: async (ctx: Koa.Context) => {
    let buckets: any[] = [];
    const { accessKey, secretKey } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
    };
    const bucketManager = getBucketManager(accessKey, secretKey);
    try {
      const bucketNames = await new Promise<string[]>((resolve, reject) => {
        bucketManager.listBucket((err, respBody, respInfo) => {
          if (err) return reject(err);
          resolve(respBody);
        });
      });
      const bucketInfoPromise = await Promise.all(
        bucketNames.map(
          (bucket) =>
            new Promise((resolve, reject) => {
              bucketManager.getBucketInfo(bucket, (err, respBody) => {
                if (err) {
                  return reject(err);
                }
                const id = nanoid();
                const bucketItem = {
                  id,
                  bucketName: bucket,
                  bucketInfo: respBody,
                  cloudName: "七牛云",
                  cloudService: "qiniu",
                  region: respBody.region,
                  auth: respBody.private === 0 ? "公开" : "私有",
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
    const { accessKey, secretKey, bucket } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
      bucket: string;
    };
    const bucketManager = getBucketManager(accessKey, secretKey);
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
    // function buildFileTree(fileList: any, prefix?: string) {
    //   const options = {
    //     limit: 1000,
    //     delimiter: "/",
    //     prefix,
    //   };
    //   bucketManager.listPrefix(bucket, options, (err, respBody, respInfo) => {
    //     const { items, commonPrefixes } = respBody;
    //     fileList.name = prefix === "" ? "根目录" : prefix;
    //     fileList.files = items;
    //     fileList.folder = [];

    //     if (commonPrefixes && commonPrefixes.length > 0) {
    //       commonPrefixes.forEach((folder: any, index: number) => {
    //         buildFileTree((fileList.folder[index] = {}), folder);
    //       });
    //     }
    //   });
    //   return fileList;
    // }

    // async function buildFileTree(fileList: any, prefix?: string) {
    //   const options = {
    //     limit: 1000,
    //     delimiter: "/",
    //     prefix,
    //   };
    //   bucketManager.listPrefix(bucket, options).then(async ({ data }) => {
    //     const { items, commonPrefixes } = data;
    //     fileList.name = prefix === "" ? "根目录" : prefix;
    //     fileList.files = items;
    //     fileList.folder = [];
    //     if (commonPrefixes && commonPrefixes.length > 0) {
    //       await Promise.all(
    //         commonPrefixes.map((folder: any, index: number) => {
    //           return buildFileTree((fileList.folder[index] = {}), folder);
    //         })
    //       );
    //     }
    //   });
    //   return fileList;
    // }

    // buildFileTree(fileList, "");
  },
};

export default qiniuController;
