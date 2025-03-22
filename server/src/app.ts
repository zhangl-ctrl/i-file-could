import Koa from "koa";
import cors from "koa2-cors";
import { qiniuRouter } from "./routes";
import bodyParser from "koa-bodyparser";

export const createApp = () => {
  const app = new Koa();
  // 设置跨域
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  // 解析请求体
  app.use(bodyParser());
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
