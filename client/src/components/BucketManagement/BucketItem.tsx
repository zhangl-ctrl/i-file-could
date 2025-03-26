import React from "react";
import { Card, Row, Col, Tag } from "antd";
import {
  FundProjectionScreenOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { CloudStorageInfo } from "./type";
import Text from "@/components/Text";
import resourc_logo from "@/assets/images/resourc_logo.png";
import { useNavigate } from "react-router-dom";
import qiniu_logo from "@/assets/images/qiniu_logo.png";
import tencent_logo from "@/assets/images/tencent_logo.png";
import { QINIU_REGION } from "@/common/cloudService";
import formatDate from "@/utils/formatDate";

type T_Region = keyof typeof QINIU_REGION;

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
  const navigate = useNavigate();
  const handleNavigateBucket = (bucket: CloudStorageInfo) => {
    navigate(`/file-management/${bucket.cloudService}/${bucket.bucketName}`);
  };

  return (
    <Card actions={actions} style={{ width: 400 }}>
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
            </div>
          </div>
        </Col>
        <Col>
          <EllipsisOutlined className="cursor-pointer" />
        </Col>
      </Row>
      <Row className="mt-[20px]" justify="space-between">
        <Col>
          <div className="flex items-center">
            {bucket.cloudService === "qiniu" ? (
              <img
                className="h-[30px] mr-[10px]"
                src={qiniu_logo}
                alt="qiniu_logo"
              />
            ) : (
              <img
                className="h-[30px] mr-[10px]"
                src={tencent_logo}
                alt="tencent_logo"
              />
            )}

            <span className="text-[14px] font-semibold">七牛云 OSS</span>
          </div>
        </Col>
      </Row>
      <Row className="mt-[10px]" justify="space-between">
        <Col>
          <Text text="区域" />
        </Col>
        <Col>
          <Text text={QINIU_REGION[bucket.region as T_Region]} />
        </Col>
      </Row>
      <Row className="mt-[10px]" justify="space-between">
        <Col>
          <Text text="权限" />
        </Col>
        <Col>
          {bucket.bucketInfo.private === 0 ? (
            <Tag color="#87d068">
              <span className="text-[#fff]">{bucket.auth}</span>
            </Tag>
          ) : (
            <Tag color="#f50">
              <span className="text-[#fff]">{bucket.auth}</span>
            </Tag>
          )}
        </Col>
      </Row>
      <Row className="mt-[10px]" justify="space-between">
        <Col>
          <Text text="创建时间" />
        </Col>
        <Col>
          <Text text={formatDate(bucket.bucketInfo.ctime)} />
        </Col>
      </Row>
    </Card>
  );
};

export default BucketItem;
