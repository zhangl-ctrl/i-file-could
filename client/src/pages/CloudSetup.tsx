import React, { useState } from "react";
import { Card, Flex, Row, Col, Input, Modal, message, Button } from "antd";
// import cloudService from "@/assets/images/cloudService.png";
import qiniu_logo from "@/assets/images/qiniu_logo.png";
import tencent_logo from "@/assets/images/tencent_logo.png";
import { useTranslation } from "react-i18next";
import Text from "@/components/Text";
import { useSelector, useDispatch } from "react-redux";
import Copy from "@/components/Copy";
import { setServiceKey } from "@/store/cloudServiceSlice";
import { PlusSquareOutlined } from "@ant-design/icons";

const CloudSetup: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const qiniu = useSelector((state: any) => state.cloudService.qiniuService);
  // 控制访问凭证 Modal
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const handleProofConfirm = () => {
    dispatch(setServiceKey(proof));
    setIsProofModalOpen(false);
    messageApi.success("更新凭证成功");
  };
  const handlepProofCancel = () => {
    setIsProofModalOpen(false);
  };
  const handleOpenProofModal = () => {
    setIsProofModalOpen(true);
  };

  const [proof, setProof] = useState({
    accessKey: qiniu.accessKey,
    secretKey: qiniu.secretKey,
  });
  const { t } = useTranslation("common");

  return (
    <>
      <Row className="mb-[16px]" justify="space-between">
        <Col>
          <span className="text-[16px] font-semibold">
            {t("cloudVendorManagement")}
          </span>
        </Col>
        {/* <Col>
          <Button type="primary" icon={<PlusSquareOutlined />}>
            {t("createBucket")}
          </Button>
        </Col> */}
      </Row>
      <Flex gap="large">
        <Card style={{ width: 400 }}>
          <Row>
            <Col>
              <div className="h-[40px] flex items-center">
                <img
                  className="w-[40px] h-[40px] mr-[8px]"
                  src={qiniu_logo}
                  alt="qiniu_logo"
                />
                <p className="text-[24px] font-semibold">七牛云 OSS</p>
              </div>
            </Col>
          </Row>
          <Row justify="space-between" className="mt-[16px]">
            <Col>
              <span className="text-[16px]">访问凭证</span>
            </Col>
            <Col>
              <span
                className="text-[16px] text-[#1677ff] cursor-pointer active:text-[#99bbff]"
                onClick={handleOpenProofModal}
              >
                更新凭证
              </span>
            </Col>
          </Row>
          <Row className="mt-[16px]">
            <Col span={24}>
              <div>
                <Text text="Access Key" />
                <div className="flex">
                  <Input
                    className="w-[200px]"
                    value={qiniu.accessKey}
                    disabled
                  />
                  <Copy text={qiniu.accessKey} />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-[16px]">
            <Col span={24}>
              <div>
                <p></p>
                <Text text="Secret Key" />
                <div className="flex">
                  <Input
                    className="w-[200px]"
                    value={qiniu.secretKey}
                    disabled
                  />
                  <Copy text={qiniu.secretKey} />
                </div>
              </div>
            </Col>
          </Row>
          <Row justify="space-between" className="mt-[16px]">
            <Col>
              <Text text="凭证有效期：" />
              <Text text="永久" />
            </Col>
          </Row>
          <Modal
            title="设置访问凭证"
            open={isProofModalOpen}
            onOk={handleProofConfirm}
            onCancel={handlepProofCancel}
          >
            <Row className="mt-[16px]">
              <Col span={24}>
                <Input
                  addonBefore="Access Key"
                  defaultValue={qiniu.accessKey}
                  onChange={(e) =>
                    setProof({ ...proof, accessKey: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row className="mt-[16px]">
              <Col span={24}>
                <Input
                  addonBefore="Secret Key"
                  defaultValue={qiniu.secretKey}
                  onChange={(e) =>
                    setProof({ ...proof, secretKey: e.target.value })
                  }
                />
              </Col>
            </Row>
            {contextHolder}
          </Modal>
        </Card>
        <Card style={{ width: 400 }}>
          <Row>
            <Col>
              <div className="h-[40px] flex items-center">
                <img
                  className="w-[40px] mr-[8px]"
                  src={tencent_logo}
                  alt="qiniu_logo"
                />
                <p className="text-[24px] font-semibold">腾讯云 OSS</p>
              </div>
            </Col>
          </Row>
          <Row justify="space-between" className="mt-[16px]">
            <Col>
              <span className="text-[16px]">访问凭证</span>
            </Col>
            <Col>
              <span
                className="text-[16px] text-[#1677ff] cursor-pointer active:text-[#99bbff]"
                onClick={handleOpenProofModal}
              >
                更新凭证
              </span>
            </Col>
          </Row>
          <Row className="mt-[16px]">
            <Col span={24}>
              <div>
                <Text text="Access Key" />
                <div className="flex">
                  <Input
                    className="w-[200px]"
                    value={qiniu.accessKey}
                    disabled
                  />
                  <Copy text={qiniu.accessKey} />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-[16px]">
            <Col span={24}>
              <div>
                <p></p>
                <Text text="Secret Key" />
                <div className="flex">
                  <Input
                    className="w-[200px]"
                    value={qiniu.secretKey}
                    disabled
                  />
                  <Copy text={qiniu.secretKey} />
                </div>
              </div>
            </Col>
          </Row>
          <Row justify="space-between" className="mt-[16px]">
            <Col>
              <Text text="凭证有效期：" />
              <Text text="永久" />
            </Col>
          </Row>
          <Modal
            title="设置访问凭证"
            open={isProofModalOpen}
            onOk={handleProofConfirm}
            onCancel={handlepProofCancel}
          >
            <Row className="mt-[16px]">
              <Col span={24}>
                <Input
                  addonBefore="Access Key"
                  defaultValue={qiniu.accessKey}
                  onChange={(e) =>
                    setProof({ ...proof, accessKey: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row className="mt-[16px]">
              <Col span={24}>
                <Input
                  addonBefore="Secret Key"
                  defaultValue={qiniu.secretKey}
                  onChange={(e) =>
                    setProof({ ...proof, secretKey: e.target.value })
                  }
                />
              </Col>
            </Row>
            {contextHolder}
          </Modal>
        </Card>
      </Flex>
    </>
  );
};

export default CloudSetup;
