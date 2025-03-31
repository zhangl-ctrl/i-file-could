import React, { useEffect, useState } from "react";
import type { TabsProps } from "antd";
import { Row, Col, Button, Tabs, Input, Space } from "antd";
import { useTranslation } from "react-i18next";
import { PlusSquareOutlined, UndoOutlined } from "@ant-design/icons";
import BucketList from "@/components/BucketManagement/BucketList";
import { useSelector, useDispatch } from "react-redux";
import { getQiniuBuckets } from "@/api/qiniuService";
import { setQiniuBuckets } from "@/store/cloudServiceSlice";

const { Search } = Input;

const BucketContainer: React.FC<{ type: string }> = ({ type }) => {
  const dispatch = useDispatch();
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );
  const [buckets, setBuckets] = useState([]);
  const [searchKey, setSearchKey] = useState<string>("");
  // 获取七牛云的存储桶列表并且设置到 store 中
  async function setBucketsToQiniu() {
    try {
      const res = await getQiniuBuckets(accessKey, secretKey);
      dispatch(setQiniuBuckets(res));
      setBuckets(res);
    } catch (err) {
      console.error(err);
    }
  }
  // 获取腾讯云的存储桶列表
  async function setBucketsToTencent() {}
  useEffect(() => {
    if (type === "qiniu") {
      setBucketsToQiniu();
    } else if (type === "tencent") {
      setBucketsToTencent();
    }
  }, []);

  // const handleRefresh = async () => {
  //   try {
  //     const res = await getQiniuBuckets(accessKey, secretKey);
  //     dispatch(setQiniuBuckets(res));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // const onSearch = (key: string) => {
  //   console.log(key);
  //   // setSearchKey();
  // };

  return (
    <>
      <Row className="mb-[16px] flex justify-between">
        <Col>
          <Search
            placeholder="搜索存储桶"
            onSearch={(key: string) => setSearchKey(key)}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Space>
            {/* <Button icon={<UndoOutlined />} onClick={handleRefresh}> */}
            <Button icon={<UndoOutlined />} onClick={setBucketsToQiniu}>
              刷新存储桶
            </Button>
            <Button type="primary" icon={<PlusSquareOutlined />}>
              创建存储桶
            </Button>
          </Space>
        </Col>
      </Row>
      <BucketList buckets={buckets} searchKey={searchKey} />
    </>
  );
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "七牛云 OSS",
    children: <BucketContainer type="qiniu" />,
  },
  {
    key: "2",
    label: "腾讯云 COS",
    children: <BucketContainer type="tencent" />,
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
        <Col span={24}>
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
