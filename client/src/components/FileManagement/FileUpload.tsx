import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, Upload, Button, Select } from "antd";
import { UploadOutlined, ToTopOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const FileUpload: React.FC = () => {
  const { t } = useTranslation("common");
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <Card>
      <div className="flex justify-between">
        <div className="font-semibold text-[16px]">{t("fileUpload")}</div>
        <div className="flex justify-between">
          {/* <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
              { value: "disabled", label: "Disabled", disabled: true },
            ]}
          /> */}
          {/* <Button type="primary" icon={<ToTopOutlined />} className="ml-[10px]">
            {t("uploadFile")}
          </Button> */}
        </div>
      </div>
      <Row className="mt-[16px]">
        <Col span={24}>
          <Dragger>
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
