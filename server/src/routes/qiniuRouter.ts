import Router from "koa-router";
import qiniuController from "../controllers/qiniuController";

const router = new Router();

router.post("/qiniu/getQiniuToken", qiniuController.getToken);
router.post("/qiniu/getQiniuBuckets", qiniuController.getBuckets);
router.post("/qiniu/getQiniuFilelist", qiniuController.getFileList);
router.post("/qiniu/createBucket", qiniuController.createBucket);
router.post("/qiniu/deleteBucket", qiniuController.deleteBucket);
router.post("/qiniu/createDirectory", qiniuController.createDirectory);

export default router;
