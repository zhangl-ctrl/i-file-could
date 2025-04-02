import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, Upload } from "antd";
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
  const currentCrumbs = useSelector((state: any) => state.status.currentCrumbs);
  const beforeUpload = (file: UploadFile, list: UploadFile[]) => {
    setFileList([...fileList, ...list]);
    const directorys = currentCrumbs.slice(1).join("");
    const fileInfoList = list.map((file: UploadFile) => {
      const id = nanoid();
      const key = directorys + file.name;
      return { id, fileName: key };
    });
    setCurrentUploadFile([...currentUploadFile, ...fileInfoList]);
    return false;
  };

  const handleRemoveFile = (file: any) => {
    setCurrentUploadFile((uploadFile: any) =>
      uploadFile.filter((item: any) => file.id !== item.id)
    );
  };

  const handleUploadFile = (event: any) => {
    setBeginUpload(true);
    const directorys = currentCrumbs.slice(1).join("");
    const file = event.file;
    const key = directorys + file.name;
    const uploadFile = qiniuManger.uploadFile(file, key, token);
    uploadFile.observer({
      next(res: any) {
        console.log("next", res);
        let status: FileUploadStatus = "uploading";
        setCurrentUploadFile((currentUploadFile: any) => {
          return currentUploadFile.map((item: any) => {
            return item.fileName === key
              ? { ...item, fileUploadInfo: res.total, status }
              : item;
          });
        });
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
