import Router from "koa-router";
import qiniuController from "../controllers/qiniuController";

const router = new Router();

router.get("/qiniu/getToken", qiniuController.getToken);

export default router;
