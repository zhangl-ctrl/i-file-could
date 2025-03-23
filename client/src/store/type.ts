export type Status = {
  collapsed: boolean;
  language: string;
};

export type QiniuService = {
  accessKey: string;
  secretKey: string;
};

export type TencentService = {
  accessKey: string;
  secretKey: string;
};

export interface Cloud {
  qiniuService: QiniuService;
  tencentService: TencentService;
}
