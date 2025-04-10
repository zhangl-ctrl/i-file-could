// import Logger from "./logger";
import { nanoid } from "nanoid";
import { DataType } from "./type";
import formatDate from "@/utils/formatDate";
import { useLocation } from "react-router-dom";

class QiniuLogger {
  qiniuRequest: any;
  db: any;
  constructor() {
    // super();
    this.buildQiniuIDB();
  }
  // 构建七牛云日志数据库
  buildQiniuIDB() {
    this.qiniuRequest = window.indexedDB.open("Logger", 1);
    // 回调函数需要使用箭头函数
    this.qiniuRequest.onerror = (event: any) => {
      console.error("Error", event);
    };
    this.qiniuRequest.onsuccess = (event: any) => {
      this.db = event.target.result;
    };
    this.qiniuRequest.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      let objectStore: any = null;
      if (!this.db.objectStoreNames.contains("qiniu_logger")) {
        objectStore = this.db.createObjectStore("qiniu_logger", {
          keyPath: "id",
        });
        objectStore.createIndex("eventName", "eventName", { unique: false });
        objectStore.createIndex("status", "status", { unique: false });
        objectStore.createIndex("infoType", "infoType", { unique: false });
      }
    };
  }
  // 添加记录
  addLogger(params: DataType) {
    const id = nanoid();
    const config = {
      id,
      key: id,
      couldService: "七牛云",
      date: Date.now(),
      env: import.meta.env.MODE,
      ...params,
    };
    // console.log("config", config);
    // 格式化日期
    config.date = formatDate(config.date);
    if (config.status === "success") {
      config.detail = `${
        config.date
      } [IFileCloud ${config.status?.toUpperCase()}] ${config.message}`;
    } else if (config.status === "error") {
      config.detail = `${
        config.date
      } [IFileCloud ${config.status?.toUpperCase()}]\n------Error Stack Begin------\n${
        config.stack
      }\n-------Error Stack End-------\nresponse: ${JSON.stringify(
        config.errorMsg,
        null,
        2
      )}`;
    }
    const transaction = this.db.transaction(["qiniu_logger"], "readwrite");
    const objectStore = transaction.objectStore("qiniu_logger");
    objectStore.add(config);
  }
  // 删除记录
  deleteLogger(id: string): Promise<boolean> {
    const transaction = this.db.transaction(["qiniu_logger"], "readwrite");
    const objectStore = transaction.objectStore("qiniu_logger");
    const request = objectStore.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = function () {
        resolve(true);
      };
      request.onerror = function () {
        reject(false);
      };
    });
  }
  // 获取记录
  async getLogger(config = {}): Promise<DataType[]> {
    const transaction = this.db.transaction(["qiniu_logger"], "readonly");
    const objectStore = transaction.objectStore("qiniu_logger");
    const getAllRequest = objectStore.getAll();

    return new Promise((resolve, reject) => {
      getAllRequest.onsuccess = (event: any) => {
        const result = event.target.result.reverse();
        resolve(result);
      };
      getAllRequest.onerror = (event: any) => {
        reject(event);
      };
    });
  }
}

export default new QiniuLogger();
