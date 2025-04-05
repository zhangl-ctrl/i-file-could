import qiniu from "qiniu";

export default function getBucketManager(accessKey: string, secretKey: string) {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  return new qiniu.rs.BucketManager(mac, config);
}
