import React from "react";
import { Card, Row, Col, Upload, Button, Select } from "antd";
import { UploadOutlined, ToTopOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const FileUpload: React.FC = () => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <Card>
      <div className="flex justify-between">
        <div className="font-semibold text-[16px]">文件上传</div>
        <div className="w-[240px] flex justify-between">
          {/* <Search placeholder="请输入文件名" style={{ width: 200 }} /> */}
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
              { value: "disabled", label: "Disabled", disabled: true },
            ]}
          />
          <Button type="primary" icon={<ToTopOutlined />}>
            上传文件
          </Button>
        </div>
      </div>
      <Row className="mt-[16px]">
        <Col span={24}>
          <Dragger>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            <p className="ant-upload-hint">
              支持任意类型文件，单个文件最大 500 MB
            </p>
          </Dragger>
        </Col>
      </Row>
    </Card>
  );
};

export default FileUpload;
