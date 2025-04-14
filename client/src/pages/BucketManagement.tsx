import React, { useEffect, useState, useRef } from "react";
import type { TabsProps } from "antd";
import { Row, Col, Button, Tabs, Input, Space, Spin, message } from "antd";
import { useTranslation } from "react-i18next";
import { PlusSquareOutlined, UndoOutlined } from "@ant-design/icons";
import BucketList from "@/components/BucketManagement/BucketList";
import { useSelector, useDispatch } from "react-redux";
import { getQiniuBuckets } from "@/api/qiniuService";
import { setQiniuBuckets } from "@/store/cloudServiceSlice";
import CreateBucketModal from "@/components/BucketManagement/CreateBucketModal";

const { Search } = Input;

const BucketContainer: React.FC<{
  type: string;
}> = ({ type }) => {
  const isInitialRender = useRef(true);
  const dispatch = useDispatch();
  const [loadding, setLoadding] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [buckets, setBuckets] = useState([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );
  // 获取七牛云的存储桶列表并且设置到 store 中
  async function setBucketsToQiniu() {
    try {
      setLoadding(true);
      const res = await getQiniuBuckets(accessKey, secretKey);
      dispatch(setQiniuBuckets(res.data));
      setBuckets(res.data);
    } catch (err: any) {
      console.log("err", err);
      message.open({
        type: "error",
        content: err.message,
      });
    } finally {
      setLoadding(false);
    }
  }

  // const setBucketsToQiniu = useCallback(async () => {
  //   try {
  //     setLoadding(true);
  //     const res = await getQiniuBuckets(accessKey, secretKey);
  //     console.log("====", res);
  //     dispatch(setQiniuBuckets(res));
  //     setBuckets(res);
  //     qiniuLogger.addLogger({
  //       eventName: "获取存储桶列表",
  //       status: "success",
  //       infoType: "network",
  //       path: location.pathname,
  //     });
  //   } catch (err: any) {
  //     qiniuLogger.addLogger({
  //       eventName: "获取存储桶列表",
  //       status: "error",
  //       infoType: "network",
  //       path: location.pathname,
  //       errorMsg: err.stack,
  //     });
  //   } finally {
  //     setLoadding(false);
  //   }
  // }, []);

  // 获取腾讯云的存储桶列表
  async function setBucketsToTencent() {}

  const handleDeleteBucket = (status: boolean) => {
    setLoadding(status);
    if (!status) {
      setBucketsToQiniu();
    }
  };
  const handleCreateBucket = () => {
    setShowCreateModal(true);
  };
  const handleConfirm = async () => {
    setShowCreateModal(false);
    setBucketsToQiniu();
  };
  const handleCancel = () => {
    setShowCreateModal(false);
  };

  useEffect(() => {
    if (type === "qiniu") {
      if (isInitialRender.current) {
        isInitialRender.current = false;
        setBucketsToQiniu();
      }
    } else if (type === "tencent") {
      setBucketsToTencent();
    }
  }, []);

  return (
    <>
      <Spin spinning={loadding} size="large">
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
              <Button icon={<UndoOutlined />} onClick={setBucketsToQiniu}>
                刷新存储桶
              </Button>
              <Button
                type="primary"
                icon={<PlusSquareOutlined />}
                onClick={handleCreateBucket}
              >
                创建存储桶
              </Button>
            </Space>
          </Col>
        </Row>
        <BucketList
          buckets={buckets}
          searchKey={searchKey}
          onDelete={handleDeleteBucket}
        />
      </Spin>
      <CreateBucketModal
        open={showCreateModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      />
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
