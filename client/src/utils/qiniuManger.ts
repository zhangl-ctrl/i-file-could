import * as qiniu from "qiniu-js";

export type UploadObserver = {
  next: (res: any) => void;
  error: (err: any) => void;
  complete: (res: any) => void;
};

class QiniuManger {
  uploadFile(file: File, key: string, token: string) {
    const config = {};
    const putExtra = {};
    return {
      observer: (observer: UploadObserver) => {
        const observable = qiniu.upload(file, key, token, putExtra, config);
        observable.subscribe(observer);
      },
    };
  }
  createDirectory(key: string, token: string) {
    const config = {};
    const putExtra = {};
    key = key + "/";
    return {
      observer: (observer: UploadObserver) => {
        const file = new File([], key, {
          type: "application/octet-stream",
        });
        const observable = qiniu.upload(file, key, token, putExtra, config);
        observable.subscribe(observer);
      },
    };
  }
}

export default new QiniuManger();
