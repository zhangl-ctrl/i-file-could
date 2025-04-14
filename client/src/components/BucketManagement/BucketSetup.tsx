import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Row, Col, Drawer, Button, Table, Tag } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  domain: string;
  ctime: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "域名",
    dataIndex: "domain",
    key: "domain",
  },
  {
    title: "创建时间",
    dataIndex: "ctime",
    key: "ctime",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (_, render) => {
      console.log("render", render);

      return <Tag color="green">启用</Tag>;
    },
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (_, record: any) => (
  //     <Space size="middle">
  //       <a>设为默认</a>
  //       <a>解绑</a>
  //     </Space>
  //   ),
  // },
];

const data: DataType[] = [
  {
    key: "1",
    domain: "linghualuan.jtxl.xyz",
    ctime: "2025-03-12 10:20:45",
  },
  {
    key: "2",
    domain: "qiniu.jtxl.xyz",
    ctime: "2025-03-12 10:20:45",
  },
];

const BucketSetup: React.FC<{
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}> = ({ open, onClose }) => {
  // const handleClick = () => {
  //   console.log("0000");
  // };
  return (
    <Drawer
      title="管理配置"
      onClose={onClose}
      open={open}
      width={700}
      closable={false}
      extra={
        <CloseOutlined
          className="cursor-pointer hover:scale-140 transition-transform duration-150 ease-in-out"
          onClick={onClose}
        />
      }
    >
      <div className="bg-[#f0f0f0] p-[10px]">
        <Row className="flex justify-between">
          <Col>
            <span className="text-[16px]">域名管理</span>
          </Col>
          <Col>
            <Button type="primary">添加域名</Button>
          </Col>
        </Row>
        <div className="mt-[20px]">
          <Table<DataType>
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default BucketSetup;
