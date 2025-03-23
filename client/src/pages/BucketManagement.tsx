import React from "react";
import type { TabsProps } from "antd";
import { Row, Col, Button, Tabs, Input, Space } from "antd";
import { useTranslation } from "react-i18next";
import { PlusSquareOutlined, UndoOutlined } from "@ant-design/icons";
import BucketList from "@/components/BucketManagement/BucketList";

const { Search } = Input;

const BucketContainer: React.FC = () => {
  const onSearch = () => {
    console.log("搜索");
  };

  return (
    <>
      <Row className="mb-[16px] flex justify-between">
        <Col>
          <Search
            placeholder="搜索存储桶"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Space>
            <Button icon={<UndoOutlined />}>刷新存储桶</Button>
            <Button type="primary" icon={<PlusSquareOutlined />}>
              创建存储桶
            </Button>
          </Space>
        </Col>
      </Row>
      <BucketList />
    </>
  );
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "全部",
    children: <BucketContainer />,
  },
  {
    key: "2",
    label: "七牛云 OSS",
    children: <BucketContainer />,
  },
  {
    key: "3",
    label: "腾讯云 COS",
    children: <BucketContainer />,
  },
];

const BucketManagement: React.FC = () => {
  const { t } = useTranslation("common");
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <Row className="mb-[10px]" justify="space-between">
        <Col>
          <span className="text-[16px] font-semibold">
            {t("bucketManagement")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            popupClassName="bg-[red]"
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default BucketManagement;
