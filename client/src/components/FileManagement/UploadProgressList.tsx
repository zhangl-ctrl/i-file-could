import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Row, Col, Progress, Button, Tag } from "antd";
import { MinusOutlined, ToTopOutlined, SyncOutlined } from "@ant-design/icons";
import type { ProgressProps } from "antd";
import noDataImg from "@/assets/images/无数据.png";
import { FILE_UPLOAD_STATUS } from "@/common/cloudService";
import type { FileUploadStatus } from "./FileUpload";
import formatFileSize from "@/utils/formatFileSize";

const twoColors: ProgressProps["strokeColor"] = {
  "0": "#108ee9",
  "100%": "#87d068",
};

const colorMap: {
  uploading: string;
  success: string;
  error: string;
} = {
  uploading: "#1677ff",
  success: "#389e0d",
  error: "#fa541c",
};

const UploadProgressList: React.FC<{
  beginUpload: boolean;
  currentUploadFile: File[];
  onRemoveFile: (file: any) => void;
}> = ({ currentUploadFile, onRemoveFile, beginUpload }) => {
  // 文件上传进度组件是否折叠
  const [fold, setFold] = useState<boolean>(false);
  useEffect(() => {
    if (beginUpload) {
      setFold(true);
    }
  }, [beginUpload]);

  return createPortal(
    <>
      {fold ? (
        <div className="w-[400px] bg-[#fff] fixed right-[20px] bottom-[20px] rounded-xl box-border shadow-lg border-[1px] border-[#eee]">
          <header className="flex items-center justify-between h-[60px] border-b border-[#ccc] border-dashed box-border p-[10px]">
            <span>
              <strong className="text-[18px]">上传进度</strong>
            </span>
            <MinusOutlined
              className="cursor-pointer hover:scale-120 transition-transform duration-100 ease-in-out"
              onClick={() => setFold(false)}
            />
          </header>
          <div className="p-[10px]">
            {currentUploadFile.length > 0 ? (
              <div>
                {currentUploadFile.map((file: any) => {
                  return (
                    <div className="mb-[10px]" key={file.id}>
                      <Row className="flex justify-between">
                        <Col span={14}>
                          <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                            {file.fileName.split("/").at(-1)}
                          </div>
                        </Col>
                        <Col>
                          {file.fileUploadInfo ? (
                            <span>
                              {formatFileSize(file.fileUploadInfo.loaded)} /{" "}
                              {formatFileSize(file.fileUploadInfo.size)}
                            </span>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <Row className="flex justify-end">
                        <Col span={24}>
                          {file.fileUploadInfo ? (
                            <Progress
                              percent={file.fileUploadInfo.percent.toFixed(2)}
                              strokeColor={twoColors}
                            />
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <Row className="flex justify-between mt-[4px]">
                        <Col>
                          <Tag
                            color={colorMap[file.status as FileUploadStatus]}
                            icon={
                              file.status === "uploading" && (
                                <SyncOutlined spin />
                              )
                            }
                          >
                            {
                              FILE_UPLOAD_STATUS[
                                file.status as FileUploadStatus
                              ]
                            }
                          </Tag>
                        </Col>
                        <Col>
                          {file.status === "uploading" ? (
                            <div className="text-[#f5222d] mt-[4px] cursor-pointer hover:text-[#ff9c6e]">
                              停止
                            </div>
                          ) : (
                            <div
                              className="text-[#1677ff] mt-[4px] cursor-pointer hover:text-[#69b1ff]"
                              onClick={() => onRemoveFile(file)}
                            >
                              移除
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  );
                })}

                {/* <div>
                  <Row className="flex justify-between">
                    <Col>设计文档最终版.pdf</Col>
                    <Col>3.5 MB / 15 MB</Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Progress percent={99.9} strokeColor={twoColors} />
                    </Col>
                  </Row>
                  <Row className="flex justify-between mt-[4px]">
                    <Col>
                      <span className="text-red-500">上传失败</span>
                    </Col>
                    <Col>
                      <div className="text-[red] cursor-pointer hover:text-[#ccc]">
                        取消
                      </div>
                    </Col>
                  </Row>
                </div> */}
              </div>
            ) : (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-center flex flex-col items-center">
                  <img
                    className="w-[80px] mb-[6px]"
                    src={noDataImg}
                    alt="无数据"
                  />
                  <div className="text-[#8a8a8a] text-[18px]">暂无上传文件</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="fixed right-[40px] bottom-[40px] rounded-xl">
          <Button
            type="primary"
            shape="circle"
            icon={<ToTopOutlined />}
            size="large"
            style={{ width: "60px", height: "60px" }}
            onClick={() => setFold(true)}
          />
        </div>
      )}
    </>,

    document.body
  );
};

export default UploadProgressList;
