import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, Upload, Button } from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import qiniuManger from "@/utils/qiniuManger";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UploadProgressList from "@/components/FileManagement/UploadProgressList";
import { nanoid } from "nanoid";
import { FILE_UPLOAD_STATUS } from "@/common/cloudService";

export type FileUploadStatus = keyof typeof FILE_UPLOAD_STATUS;

const { Dragger } = Upload;

const FileUpload: React.FC = () => {
  const { bucket } = useParams();
  const { t } = useTranslation("common");
  const [beginUpload, setBeginUpload] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentUploadFile, setCurrentUploadFile] = useState<any>([]);
  const token = useSelector(
    (state: any) =>
      state.cloudService.qiniuService.bucketTokens[bucket as string]
  );
  const beforeUpload = (file: UploadFile, list: UploadFile[]) => {
    setFileList([...fileList, ...list]);
    const fileInfoList = list.map((file: UploadFile) => {
      const id = nanoid();
      return { id, fileName: file.name };
    });
    setCurrentUploadFile([...currentUploadFile, ...fileInfoList]);
    return false;
  };

  const handleShowList = () => {
    console.log("fileList", currentUploadFile);
  };

  const handleRemoveFile = (file: any) => {
    setCurrentUploadFile((uploadFile: any) =>
      uploadFile.filter((item: any) => file.id !== item.id)
    );
  };

  const handleUploadFile = (event: any) => {
    setBeginUpload(true);
    const file = event.file;
    const key = file.name;
    const uploadFile = qiniuManger.uploadFile(file, key, token);
    uploadFile.observer({
      next(res: any) {
        let status: FileUploadStatus = "uploading";
        setCurrentUploadFile((currentUploadFile: any) => {
          return currentUploadFile.map((item: any) => {
            return item.fileName === key
              ? { ...item, fileUploadInfo: res.total, status }
              : item;
          });
        });
        // console.log("next", res);
      },
      error(err: Error) {
        // console.log("error", err);
        let status: FileUploadStatus = "error";
        setCurrentUploadFile((currentUploadFile: any) => {
          return currentUploadFile.map((item: any) => {
            return item.fileName === key ? { ...item, status } : item;
          });
        });
      },
      complete(res: any) {
        // console.log("complete", res);
        let status: FileUploadStatus = "success";
        setCurrentUploadFile((currentUploadFile: any) => {
          return currentUploadFile.map((item: any) => {
            return item.fileName === key ? { ...item, status } : item;
          });
        });
      },
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between">
          <div className="font-semibold text-[16px]">{t("fileUpload")}</div>
          {/* <Button onClick={handleShowList}>查看文件列表</Button> */}
        </div>
        <Row className="mt-[16px]">
          <Col span={24}>
            <Dragger
              name="file"
              multiple={true}
              onChange={handleUploadFile}
              beforeUpload={beforeUpload}
              showUploadList={false}
              fileList={fileList}
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
      <UploadProgressList
        currentUploadFile={currentUploadFile}
        onRemoveFile={handleRemoveFile}
        beginUpload={beginUpload}
      />
    </>
  );
};

export default FileUpload;
