import React, { useEffect, useState } from "react";
import { Drawer, Row, Col, Image, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { STORAGE_TYPE } from "@/common/cloudService";
import formatDate from "@/utils/formatDate";
import formatFileSize from "@/utils/formatFileSize";
import { useSelector } from "react-redux";
import noImg from "@/assets/images/图片损坏.svg";
import { getFileDownloadLink } from "@/api/qiniuService";
import FilePreview from "@/components/FilePreview";

const FileDetail: React.FC<{
  bucket: string;
  showDrawer: boolean;
  file: Record<string, any>;
  onClose: () => void;
}> = ({ bucket, showDrawer, file, onClose }) => {
  const [fileLink, setFileLink] = useState("");
  const {
    buckets: bucketList,
    accessKey,
    secretKey,
  } = useSelector((state: any) => state.cloudService.qiniuService);
  const currentBucket = bucketList.find(
    (item: any) => item.bucketName === bucket
  );
  const { domains } = currentBucket;

  useEffect(() => {
    async function handleGetLink() {
      try {
        const { key } = file;
        const { privateAuth } = currentBucket;
        if (Array.isArray(domains) && domains.length > 0) {
          const fileLink = await getFileDownloadLink(
            accessKey,
            secretKey,
            domains[0].domain,
            key,
            privateAuth
          );
          setFileLink(fileLink);
          file.fileLink = fileLink;
        } else {
          setFileLink("--");
          file.fileLink = "--";
        }
      } catch (err: any) {
        console.error(err.message);
      }
    }
    handleGetLink();
  }, [file]);

  return (
    <>
      <Drawer
        width={700}
        title="文件详情"
        onClose={onClose}
        open={showDrawer}
        closable={false}
        extra={
          <CloseOutlined
            className="cursor-pointer hover:scale-140 transition-transform duration-150 ease-in-out"
            onClick={onClose}
          />
        }
      >
        <Row>
          <Col span={24}>
            {fileLink ? (
              <FilePreview filePath={fileLink} fileType={file.mimeType} />
            ) : (
              <FilePreview filePath={noImg} fileType={file.mimeType} />
            )}
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">文件名称</span>
          </Col>
          <Col span={18}>
            <div className="text-[16px] break-all" title={file.fileName}>
              {file.fileName}
            </div>
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">文件类型</span>
          </Col>
          <Col span={18}>
            <div className="text-[16px] break-all" title={file.mimeType}>
              {file.mimeType}
            </div>
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">文件链接</span>
          </Col>
          <Col span={18}>
            {file.fileLink ? (
              <div className="text-[16px] break-all" title={file.fileLink}>
                {file.fileLink}
              </div>
            ) : (
              "--"
            )}
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">文件大小</span>
          </Col>
          <Col>
            <span className="text-[16px]" title={formatFileSize(file.fsize)}>
              {formatFileSize(file.fsize)}
            </span>
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">存储类型</span>
          </Col>
          <Col>
            <span className="text-[16px]" title={STORAGE_TYPE[file.type]}>
              {STORAGE_TYPE[file.type]}
            </span>
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">hash 值</span>
          </Col>
          <Col>
            <span className="text-[16px]" title={file.hash}>
              {file.hash}
            </span>
          </Col>
        </Row>
        <Row className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">上传时间</span>
          </Col>
          <Col>
            <span
              className="text-[16px]"
              title={formatDate(file.putTime, {
                timestamp: true,
              })}
            >
              {formatDate(file.putTime, {
                timestamp: true,
              })}
            </span>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default FileDetail;
