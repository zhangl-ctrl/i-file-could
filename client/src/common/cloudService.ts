export const SERVICE: Record<string, string> = {
  ali: "阿里云 OSS",
  qiniu: "七牛云 OSS",
  tencent: "腾讯云 COS",
};

export const QINIU_REGION: Record<string, string> = {
  z0: "华东-浙江",
  z1: "华北-河北",
  z2: "华南-广东",
  na0: "北美-洛杉矶",
  as0: "亚太-新加坡",
  "cn-east-2": "华东-浙江2",
  "cn-northwest-1": "西北-陕西1",
  "ap-southeast-2": "亚太-河内",
  "ap-southeast-3": "亚太-胡志明",
};

export const FILE_UPLOAD_STATUS: {
  uploading: string;
  success: string;
  error: string;
} = {
  uploading: "上传中",
  success: "上传成功",
  error: "上传失败",
};

export const STORAGE_TYPE: Record<number, string> = {
  0: "标准存储",
  1: "低频存储",
  2: "归档存储",
  3: "深度归档存储",
  4: "归档直读存储",
  5: "智能分层存储",
};
