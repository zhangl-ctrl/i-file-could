import Router from "koa-router";
import qiniuController from "../controllers/qiniuController";

const router = new Router();

router.post("/qiniu/getToken", qiniuController.getToken);
router.post("/qiniu/getBuckets", qiniuController.getBuckets);

export default router;
