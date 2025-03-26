import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import QiniuManger from "@/utils/qiniuManger";
import { useSelector } from "react-redux";
// import {  }

const { Dragger } = Upload;

const FileUpload: React.FC = () => {
  const { t } = useTranslation("common");
  const token = useSelector(
    (state: any) => state.cloudService.qiniuService.token
  );
  const handleUploadFile = (event: any) => {
    const file = event.file;
    const key = event.file.name;
    const qiniuManger = new QiniuManger(file, key, token);
    qiniuManger.uploadFile();
  };

  return (
    <Card>
      <div className="flex justify-between">
        <div className="font-semibold text-[16px]">{t("fileUpload")}</div>
      </div>
      <Row className="mt-[16px]">
        <Col span={24}>
          <Dragger
            name="file"
            multiple={false}
            onChange={handleUploadFile}
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">{t("checkOrDragFileToUpload")}</p>
            <p className="ant-upload-hint">{t("SupportTypeOfFile")}</p>
          </Dragger>
        </Col>
      </Row>
    </Card>
  );
};

export default FileUpload;
