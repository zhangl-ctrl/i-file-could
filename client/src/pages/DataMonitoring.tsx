import React from "react";
import { Row, Col, Tabs } from "antd";
import type { TabsProps } from "antd";
import QiniuDataMonitoring from "@/components/DataMonitoring/QiniuDataMonitoring";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "七牛云",
    children: <QiniuDataMonitoring />,
  },
  {
    key: "2",
    label: "腾讯云",
    children: "linghualuan1111",
  },
];

const DataMonitoring: React.FC = () => {
  const handleChange = () => {
    console.log("标签切换");
  };

  return (
    <>
      <Row className="mb-[16px]">
        <Col>
          <span className="text-[16px] font-semibold">数据监控</span>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1" items={items} onChange={handleChange} />
    </>
  );
};

export default DataMonitoring;
