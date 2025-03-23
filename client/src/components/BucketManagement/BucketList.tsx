import { Flex } from "antd";
import BucketItem from "./BucketItem";
import React, { Fragment } from "react";
import { CloudStorageInfo } from "./type";

const bucketList: CloudStorageInfo[] = [
  {
    id: 1,
    bucketName: "图片资源",
    cloudOrgin: "Ali",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 2,
    bucketName: "视频资源",
    cloudOrgin: "Tencent",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 3,
    bucketName: "压缩包资源",
    cloudOrgin: "Qiniu",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 4,
    bucketName: "音频资源",
    cloudOrgin: "Qiniu",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 5,
    bucketName: "文档资源",
    cloudOrgin: "Tencent",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 6,
    bucketName: "代码资源",
    cloudOrgin: "Tencent",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
];

const BucketList: React.FC = () => {
  return (
    <>
      <Flex wrap gap="large">
        {bucketList.map((bucket) => {
          return (
            <Fragment key={bucket.id}>
              <BucketItem bucket={bucket} />
            </Fragment>
          );
        })}
      </Flex>
    </>
  );
};

export default BucketList;
