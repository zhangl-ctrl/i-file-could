import React, { Fragment } from "react";
import { Row, Col, Button, Flex } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import { CloudStorageInfo } from "./type";
import BucketItem from "./BucketItem";

const bucketList: CloudStorageInfo[] = [
  {
    id: 1,
    bucketName: "图片资源",
    cloudOrgin: "阿里云 OSS",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 2,
    bucketName: "图片资源",
    cloudOrgin: "阿里云 OSS",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 3,
    bucketName: "图片资源",
    cloudOrgin: "阿里云 OSS",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 4,
    bucketName: "图片资源",
    cloudOrgin: "阿里云 OSS",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 5,
    bucketName: "图片资源",
    cloudOrgin: "阿里云 OSS",
    storageTotalCapacity: "5 GB",
    storageCurrentCapacity: "2.1 GB",
    totalRequests: 123456,
    visitTraffic: "58.3 GB",
    totalFiles: 1983,
  },
  {
    id: 6,
    bucketName: "图片资源",
    cloudOrgin: "阿里云 OSS",
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
      <Row className="mb-[10px]" justify="space-between">
        <Col>
          <span className="text-[16px] font-semibold">存储桶管理</span>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusSquareOutlined />}>
            创建存储桶
          </Button>
        </Col>
      </Row>
      <Flex wrap gap="large">
        {bucketList.map((bucket) => {
          return (
            <Fragment key={bucket.id}>
              <BucketItem bucket={bucket} />
            </Fragment>
          );
        })}
      </Flex>

      {/* <Card actions={actions} style={{ width: 450 }}>
        <Row justify="space-between">
          <Col>
            <div className="font-medium text-[18px]">图片资源</div>
            <Text text="阿里云 OSS" />
          </Col>
          <Col>
            <EllipsisOutlined className="cursor-pointer" />
          </Col>
        </Row>
        <Row className="mt-[10px]" justify="space-between">
          <Col>
            <Text text="存储容量" />
          </Col>
          <Col>
            <Text text="2.1GB / 5GB" />
          </Col>
          <Col span={24}>
            <Progress percent={60} showInfo={false} size="small" />
          </Col>
        </Row>
        <Row className="mt-[10px]" justify="space-between">
          <Col>
            <Text text="请求总数" />
          </Col>
          <Col>
            <Text text="125,831" />
          </Col>
        </Row>
        <Row className="mt-[10px]" justify="space-between">
          <Col>
            <Text text="访问总量" />
          </Col>
          <Col>
            <Text text="58.3 GB" />
          </Col>
        </Row>
        <Row className="mt-[10px]" justify="space-between">
          <Col>
            <Text text="文件总数" />
          </Col>
          <Col>
            <Text text="12,458" />
          </Col>
        </Row>
        <Card.Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
          }
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card> */}
    </>
  );
};

export default BucketList;
