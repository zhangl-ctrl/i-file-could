import React, { useState } from "react";
import { Card, Row, Col, Tag, Dropdown, MenuProps, message } from "antd";
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
import { deleteQiniuBucket } from "@/api/qiniuService";
import { useSelector } from "react-redux";
import BucketSetup from "@/components/BucketManagement/BucketSetup";

type T_Region = keyof typeof QINIU_REGION;

const BucketItem: React.FC<{
  bucket: CloudStorageInfo;
  onDetele: (status: boolean) => void;
}> = ({ bucket, onDetele }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );
  const navigate = useNavigate();
  const handleNavigateBucket = (bucket: CloudStorageInfo) => {
    navigate(`/file-management/${bucket.cloudService}/${bucket.bucketName}`);
  };
  const handleOpenBucketSetup = () => {
    setShowSetup(true);
  };
  const handleCancel = () => {
    console.log("handleCancel");
    setShowSetup(false);
  };
  const handleOk = () => {
    console.log("handleOk");
    setShowSetup(false);
  };
  const handleDeleteBucket = async () => {
    try {
      onDetele(true);
      await deleteQiniuBucket(accessKey, secretKey, bucket.bucketName);
      messageApi.open({
        type: "success",
        content: "删除成功",
      });
    } catch (err: any) {
      console.error("Error message: ", err);
      messageApi.open({
        type: "error",
        content: err.message,
      });
    } finally {
      onDetele(false);
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <span className="text-[#ff4d4f]" onClick={handleDeleteBucket}>
          删除
        </span>
      ),
    },
  ];
  const actions: React.ReactNode[] = [
    <div onClick={handleOpenBucketSetup}>
      <SettingOutlined key="setting" />
      <span>{" 管理配置"}</span>
    </div>,
    <div>
      <FundProjectionScreenOutlined key="setting" />
      <span>{" 监控数据"}</span>
    </div>,
  ];

  return (
    <>
      {contextHolder}
      <BucketSetup open={showSetup} onClose={handleCancel} onOk={handleOk} />
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
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <EllipsisOutlined className="cursor-pointer" />
              </a>
            </Dropdown>
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
            <Text text="区域" />
          </Col>
          <Col>
            <Text text={QINIU_REGION[bucket.region as T_Region]} />
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
    </>
  );
};

export default BucketItem;
