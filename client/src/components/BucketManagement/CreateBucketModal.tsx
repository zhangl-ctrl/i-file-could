import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Row, Col, Input, Radio, message, Spin } from "antd";
import { createQiniuBucket } from "@/api/qiniuService";

const storageOptions = [
  {
    value: "z0",
    label: "华东-浙江",
  },
  {
    value: "z1",
    label: "华北-河北",
  },
  {
    value: "z2",
    label: "华南-广东",
  },
  {
    value: "na0",
    label: "北美-洛杉矶",
  },
  {
    value: "as0",
    label: "亚太-新加坡",
  },
  {
    value: "cn-east-2",
    label: "华东-浙江2",
  },
  {
    value: "cn-northwest-1",
    label: "西北-陕北",
  },
  {
    value: "ap-southeast-2",
    label: "亚太-河内",
  },
  {
    value: "ap-southeast-3",
    label: "亚太-胡志明",
  },
];

const authOptions = [
  {
    value: 0,
    label: "公开",
  },
  {
    value: 1,
    label: "私有",
  },
];

export interface BucketParams {
  bucket: string;
  regionId: string;
  auth: number | string;
}

const bucketRegular = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
type NameStatus = "error" | "warning" | "";

const CreateBucketModal: React.FC<{
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}> = ({ open, onOk, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );
  const [backetNameStatus, setBacketNameStatus] = useState<NameStatus>("");
  const [bucketParams, setBucketParams] = useState<BucketParams>({
    bucket: "",
    regionId: "",
    auth: 0,
  });

  const handleChangeBucketName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBucketParams({ ...bucketParams, bucket: e.target.value });
    if (!bucketRegular.test(bucketParams.bucket)) {
      setBacketNameStatus("error");
    } else {
      setBacketNameStatus("");
    }
  };

  // 点击确认按钮
  const handleConfirm = async () => {
    if (!bucketRegular.test(bucketParams.bucket)) {
      setBacketNameStatus("error");
      return;
    }
    try {
      setLoading(true);
      await createQiniuBucket(
        accessKey,
        secretKey,
        bucketParams.bucket,
        bucketParams.regionId,
        bucketParams.auth
      );
      messageApi.open({
        type: "success",
        content: "创建存储桶成功",
      });
      setBacketNameStatus("");
      onOk();
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onOk={handleConfirm}
        onCancel={handleCancel}
        title="创建存储桶"
        width={600}
      >
        <Spin spinning={loading}>
          <div className="mt-[40px] mb-[40px]">
            <Row className="flex justify-between">
              <Col span={6}>
                存储空间名称<span className="text-[red]">*</span>
              </Col>
              <Col span={18}>
                <Input
                  status={backetNameStatus}
                  placeholder="请输入存储桶空间名称"
                  value={bucketParams.bucket}
                  onChange={handleChangeBucketName}
                />
              </Col>
            </Row>
            {backetNameStatus === "error" && (
              <Row>
                <Col span={6}></Col>
                <Col span={18}>
                  <p className="text-[#ff4d4f]">名称不符合格式，请重新输入</p>
                </Col>
              </Row>
            )}
            <Row className="mt-[10px]">
              <Col span={6}></Col>
              <Col span={18}>
                <div className="text-[#aaa] text-[12px]">
                  <p>存储空间名称不允许重复，遇到冲突请更换名称。</p>
                  <p>
                    名称格式为 3 ~ 63
                    个字符，可以包含小写字母、数字、短划线，且必须以小写字母或者数字开头和结尾。
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="mt-[20px]">
              <Col span={6}>存储区域</Col>
              <Col span={18}>
                <div>
                  <Radio.Group
                    options={storageOptions}
                    onChange={(e) =>
                      setBucketParams({
                        ...bucketParams,
                        regionId: e.target.value,
                      })
                    }
                  ></Radio.Group>
                </div>
              </Col>
            </Row>
            <Row className="mt-[20px]">
              <Col span={6}>访问控制</Col>
              <Col span={18}>
                <div>
                  <Radio.Group
                    options={authOptions}
                    onChange={(e) =>
                      setBucketParams({ ...bucketParams, auth: e.target.value })
                    }
                  ></Radio.Group>
                </div>
              </Col>
            </Row>
            <Row className="mt-[10px]">
              <Col span={6}></Col>
              <Col span={18}>
                <div className="text-[#aaa] text-[12px]">
                  私有权限对读、写空间内的文件均生效，需要拥有者的授权才能进行操作。
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default CreateBucketModal;
