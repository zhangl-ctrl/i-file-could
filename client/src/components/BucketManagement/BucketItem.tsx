import React from "react";
import { useState } from "react";
import { Card, Row, Col, Progress } from "antd";
import {
  FundProjectionScreenOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { CloudStorageInfo } from "./type";
import Text from "@/components/Text";
import resourc_logo from "@/assets/images/resourc_logo.png";
import { useNavigate } from "react-router-dom";

const actions: React.ReactNode[] = [
  <div>
    <SettingOutlined key="setting" />
    <span>{" 管理配置"}</span>
  </div>,
  <div>
    <FundProjectionScreenOutlined key="setting" />
    <span>{" 监控数据"}</span>
  </div>,
];

const BucketItem: React.FC<{ bucket: CloudStorageInfo }> = ({ bucket }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleNavigateBucket = (bucket: CloudStorageInfo) => {
    // console.log("查看存储桶详情内容");
    navigate(`/file-management/${bucket.cloudOrgin}/${bucket.bucketName}`);
  };

  return (
    <Card loading={loading} actions={actions} style={{ width: 400 }}>
      <Row justify="space-between">
        <Col>
          <div className="flex items-center cursor-pointer">
            <img
              className="h-[40px] mr-[10px]"
              src={resourc_logo}
              alt="resourc_logo"
            />
            <div onClick={() => handleNavigateBucket(bucket)}>
              <div className="font-medium text-[18px] hover:text-[#1677ff]">
                {bucket.bucketName}
              </div>
              <Text text={bucket.cloudOrgin} />
            </div>
          </div>
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
          <Text
            text={
              bucket.storageCurrentCapacity +
              " / " +
              bucket.storageTotalCapacity
            }
          />
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
          <Text text={bucket.totalRequests} />
        </Col>
      </Row>
      <Row className="mt-[10px]" justify="space-between">
        <Col>
          <Text text="访问总量" />
        </Col>
        <Col>
          <Text text={bucket.visitTraffic} />
        </Col>
      </Row>
      <Row className="mt-[10px]" justify="space-between">
        <Col>
          <Text text="文件总数" />
        </Col>
        <Col>
          <Text text={bucket.totalRequests} />
        </Col>
      </Row>
      {/* <Card.Meta
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
  /> */}
    </Card>
  );
};

export default BucketItem;
