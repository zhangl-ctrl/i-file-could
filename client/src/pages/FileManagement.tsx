import FileUpload from "@/components/FileManagement/FileUpload";
import FileList from "@/components/FileManagement/FileList";
import { Space, Row, Col } from "antd";
import { useParams } from "react-router-dom";
import { SERVICE } from "@/common/cloudService";

export default function FileManagement() {
  const { bucket, cloud } = useParams();
  const currentCloud = SERVICE[cloud as keyof typeof SERVICE];

  return (
    <>
      <Row>
        <Col>
          <div className="text-[16px] font-semibold mb-[16px]">{`${currentCloud} / ${bucket}`}</div>
        </Col>
      </Row>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <FileUpload />
        <FileList />
      </Space>
    </>
  );
}
