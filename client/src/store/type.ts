export type Status = {
  collapsed: boolean;
  language: string;
};

export type QiniuService = {
  accessKey: string;
  secretKey: string;
  token: string;
  buckets: Array<Object> | null;
  bucketTokens: Record<string, string>;
};

export type TencentService = {
  accessKey: string;
  secretKey: string;
  token: string;
};

export interface Cloud {
  qiniuService: QiniuService;
  tencentService: TencentService;
}
