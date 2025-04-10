import { useEffect } from "react";
import FileUpload from "@/components/FileManagement/FileUpload";
import FileList from "@/components/FileManagement/FileList";
import { Space, Row, Col, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { SERVICE } from "@/common/cloudService";
import { useSelector, useDispatch } from "react-redux";
import { getQiniuToken } from "@/api/qiniuService";
import { setQiniuToken } from "@/store/cloudServiceSlice";
import { RollbackOutlined } from "@ant-design/icons";

export default function FileManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bucket, cloud } = useParams();
  const service = useSelector((state: any) => state.cloudService);
  const currentCloud = SERVICE[cloud as keyof typeof SERVICE];

  useEffect(() => {
    if (cloud === "qiniu") {
      const {
        qiniuService: { accessKey, secretKey },
      } = service;
      if (accessKey && secretKey && bucket) {
        getQiniuToken(accessKey, secretKey, bucket).then(
          (res: any) => {
            const token = res.data;

            dispatch(setQiniuToken({ bucketName: bucket, token }));
          },
          (err) => {
            console.error("error", err);
          }
        );
      }
    } else if (cloud === "tencent") {
    }
  }, [bucket]);

  return (
    <>
      <Row className="flex justify-between">
        <Col>
          <div className="text-[16px] font-semibold mb-[16px]">{`${currentCloud} / ${bucket}`}</div>
        </Col>
        <Col>
          <div className="text-[16px] font-semibold mb-[16px] cursor-pointer hover:text-[#1677ff]">
            <Button icon={<RollbackOutlined />} onClick={() => navigate(-1)}>
              返回存储桶
            </Button>
          </div>
        </Col>
      </Row>
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", height: "calc(100% - 48px)" }}
      >
        <FileUpload />
        <FileList />
      </Space>
    </>
  );
}
