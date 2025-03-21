import FileUpload from "@/components/FileManagement/FileUpload";
import FileList from "@/components/FileManagement/FileList";
import { Space } from "antd";

export default function FileManagement() {
  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <FileUpload />
        <FileList />
      </Space>
    </>
  );
}
