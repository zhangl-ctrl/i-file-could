import Koa from "koa";
import Qiniu from "qiniu";

const accessKey = "tSrg9nWcoMnxi8DCjs56spHkJAO_9iVhUjsbEnF5";
const secretKey = "JXjo8AhXVxARq6GZzth22N-1fxA308wYUmPW0ziz";
const bucket = "zl-picture-01";

const generateQiniuToken = () => {
  const mac = new Qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
    expires: 7200,
  };
  const putPolicy = new Qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

const qiniuController = {
  getToken: (ctx: Koa.Context) => {
    const token = generateQiniuToken();
    ctx.body = {
      code: 10000,
      success: true,
      message: "请求成功",
      data: {
        token,
      },
    };
  },
};

export default qiniuController;
