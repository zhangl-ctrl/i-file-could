import * as qiniu from "qiniu-js";

class QiniuManger {
  file: File;
  key: string;
  token: string;

  constructor(file: File, key: string, token: string) {
    this.file = file;
    this.key = key;
    this.token = token;
  }

  uploadFile() {
    const config = {};
    const putExtra = {};
    const observable = qiniu.upload(
      this.file,
      this.key,
      this.token,
      putExtra,
      config
    );
    const observer = {
      next(res: any) {
        console.log("next", res);
      },
      error(err: Error) {
        console.log("error", err);
      },
      complete(res: any) {
        console.log("complete", res);
      },
    };
    observable.subscribe(observer); // 上传开始
  }
}

export default QiniuManger;
