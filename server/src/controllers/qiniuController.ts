import Koa from "koa";
import qiniu from "qiniu";
import { nanoid } from "nanoid";

qiniu.conf.ACCESS_KEY = "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5";
qiniu.conf.SECRET_KEY = "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz";

// const accessKey = "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5";
// const secretKey = "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz";
const bucket = "zl-picture-01";

function setupAuth(accessKey: string, secretKey: string) {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  return new qiniu.rs.BucketManager(mac, config);
}

// 初始化鉴权对象
// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 根据 accessKey、secretKey 和 bucket 生成 token，用于前端上传文件
const generateQiniuToken = () => {
  const mac = new qiniu.auth.digest.Mac();
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
    const token = generateQiniuToken();
    ctx.body = {
      code: 200,
      success: true,
      message: "请求成功",
      data: {
        token,
      },
    };
  },
  // 获取存储桶
  getBuckets: async (ctx: Koa.Context) => {
    console.log("ctx", ctx.request.body);
    const buckets: any[] = [];
    const { accessKey, secretKey } = ctx.request.body as {
      accessKey: string;
      secretKey: string;
    };
    const bucketManager = setupAuth(accessKey, secretKey);
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
                  cloudService: "Qiniu",
                  region: respBody.region,
                  auth: respBody.private === 0 ? "公开" : "私有",
                };
                buckets.push(bucketItem);
                resolve(respBody);
              });
            })
        )
      );

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
};

export default qiniuController;
