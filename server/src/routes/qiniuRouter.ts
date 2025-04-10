import Router from "koa-router";
import qiniuController from "../controllers/qiniuController";

const router = new Router();

router.post("/qiniu/getQiniuToken", qiniuController.getToken);
router.post("/qiniu/getQiniuBuckets", qiniuController.getBuckets);
router.post("/qiniu/getQiniuFilelist", qiniuController.getFileList);
router.post("/qiniu/createBucket", qiniuController.createBucket);
router.post("/qiniu/deleteBucket", qiniuController.deleteBucket);
router.post("/qiniu/getFileDetail", qiniuController.getFileDetail);
router.post("/qiniu/getDomainsByBucket", qiniuController.getDomainsByBucket);
router.post("/qiniu/getFileDownloadLink", qiniuController.getFileDownloadLink);
router.post("/qiniu/getSpaceOverview", qiniuController.getSpaceOverview);
router.post("/qiniu/getSpaceTendency", qiniuController.getSpaceTendency);
router.post("/qiniu/getTodaySpaceAmount", qiniuController.getTodaySpaceAmount);

export default router;
