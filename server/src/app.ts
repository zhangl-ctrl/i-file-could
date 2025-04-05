import Koa from "koa";
import cors from "koa2-cors";
import { qiniuRouter } from "./routes";
import bodyParser from "koa-bodyparser";
import getBucketManager from "./utils/getBucketManager";

export const createApp = () => {
  const app = new Koa();
  // 设置跨域
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  // 定义七牛云bucketManager实例，避免新建过多bucketManager导致性能问题
  let bucketManager: any = null;
  // 解析请求体
  app.use(bodyParser());
  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    const { accessKey, secretKey } = ctx.request.body as any;
    if (!bucketManager && accessKey && secretKey) {
      bucketManager = getBucketManager(accessKey, secretKey);
    }
    ctx.bucketManager = bucketManager;
    await next();
  });
  app.use(qiniuRouter.routes()).use(qiniuRouter.allowedMethods());
  app.on("error", (err, ctx) => {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      error: err.message,
    };
  });
  return app;
};
