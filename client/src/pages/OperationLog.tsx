import React, { useState, useEffect, useMemo } from "react";
import type { TabsProps, TableProps } from "antd";
import {
  Col,
  Row,
  Tag,
  Tabs,
  Card,
  Spin,
  Input,
  Space,
  Table,
  message,
  Popconfirm,
  Drawer,
} from "antd";
import qiniuLogger from "@/utils/Logger/QiniuLogger";
import { DataType } from "@/utils/Logger/type";

const { Search } = Input;

const TabContent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [logger, setLogger] = useState<DataType[]>();
  const [loadding, setLodding] = useState<boolean>(false);
  const [currentLogger, setCurrentLogger] = useState<DataType>();

  const columns = useMemo<TableProps<DataType>["columns"]>(
    () => [
      {
        title: "云厂商",
        dataIndex: "couldService",
        key: "couldService",
      },
      {
        title: "事件名称",
        dataIndex: "eventName",
        key: "eventName",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (text) => <Tag color={text}>{text}</Tag>,
      },
      {
        title: "信息类型",
        dataIndex: "infoType",
        key: "infoType",
        render: (text) => <Tag color="default">{text}</Tag>,
      },
      {
        title: "日期",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "操作",
        key: "action",
        render: (_, record: DataType) => {
          const handleConfirmDel = async (id: string) => {
            try {
              qiniuLogger.deleteLogger(id);
              message.open({
                type: "success",
                content: "删除记录成功",
              });
              handleGetLoagger();
            } catch (err) {
              message.open({
                type: "error",
                content: "删除记录失败",
              });
            }
          };
          const handleOpenDetail = (record: DataType) => {
            setOpen(true);
            setCurrentLogger(record);
          };
          return (
            <Space size="middle">
              <a onClick={() => handleOpenDetail(record)}>详情</a>
              <Popconfirm
                title="是否删除？"
                description="删除后记录将不可恢复，是否确认删除？"
                onConfirm={() => {
                  if (record.id) {
                    handleConfirmDel(record.id);
                  }
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    []
  );
  const handleGetLoagger = async () => {
    setLodding(true);
    const loggers = await qiniuLogger.getLogger();
    setLogger(loggers);
    setLodding(false);
  };
  const handleCloseDetail = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleGetLoagger();
  }, []);

  return (
    <>
      <Spin spinning={loadding}>
        <Row justify="end" className="mb-[16px]">
          <Col>
            <Search placeholder="请输入事件名称" />
          </Col>
        </Row>
        <Table<DataType> bordered columns={columns} dataSource={logger} />
      </Spin>
      <Drawer
        title="日志详情"
        open={open}
        onClose={handleCloseDetail}
        width={700}
      >
        <Row justify="space-between">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">云厂商</span>
          </Col>
          <Col span={18}>
            <span className="text-[16px]">{currentLogger?.couldService}</span>
          </Col>
        </Row>
        <Row justify="space-between" className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">事件名称</span>
          </Col>
          <Col span={18}>
            <span className="text-[16px]">{currentLogger?.eventName}</span>
          </Col>
        </Row>
        <Row justify="space-between" className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">状态</span>
          </Col>
          <Col span={18}>
            <Tag color={currentLogger?.status}>{currentLogger?.status}</Tag>
          </Col>
        </Row>
        <Row justify="space-between" className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">信息类型</span>
          </Col>
          <Col span={18}>
            <Tag color="default">{currentLogger?.infoType}</Tag>
          </Col>
        </Row>
        <Row justify="space-between" className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">日期</span>
          </Col>
          <Col span={18}>
            <span className="text-[16px]">{currentLogger?.date}</span>
          </Col>
        </Row>
        <Row justify="space-between" className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">请求方法</span>
          </Col>
          <Col span={18}>
            <span className="text-[16px]">{currentLogger?.method}</span>
          </Col>
        </Row>
        <Row justify="space-between" className="mt-[20px]">
          <Col span={6}>
            <span className="text-[#8c8c8c] text-[16px]">请求地址</span>
          </Col>
          <Col span={18}>
            <span className="text-[16px]">{currentLogger?.url}</span>
          </Col>
        </Row>
        {currentLogger?.status === "error" && (
          <Row justify="space-between" className="mt-[20px]">
            <Col span={6}>
              <span className="text-[#8c8c8c] text-[16px]">错误信息</span>
            </Col>
            <Col span={18}>
              <textarea
                disabled
                className="bg-[#f5f5f5] p-[10px] box-border text-[16px] rounded"
                style={{ whiteSpace: "pre", width: "100%", height: "300px" }}
                value={currentLogger?.detail}
              ></textarea>
            </Col>
          </Row>
        )}
        {currentLogger?.status === "success" && (
          <Row justify="space-between" className="mt-[20px]">
            <Col span={6}>
              <span className="text-[#8c8c8c] text-[16px]">成功信息</span>
            </Col>
            <Col span={18}>
              <textarea
                disabled
                className="bg-[#f5f5f5] p-[10px] box-border text-[16px] rounded"
                style={{ whiteSpace: "pre", width: "100%", height: "300px" }}
                value={currentLogger?.detail}
              ></textarea>
            </Col>
          </Row>
        )}
      </Drawer>
    </>
  );
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "七牛云",
    children: <TabContent key="1" />,
  },
  {
    key: "2",
    label: "腾讯云",
    children: <TabContent key="2" />,
  },
];

const OperationLog: React.FC = () => {
  const handleChange = () => {
    console.log("标签切换");
  };

  return (
    <>
      <Row className="mb-[16px]">
        <Col>
          <span className="text-[16px] font-semibold">操作日志</span>
        </Col>
      </Row>
      <Card className="card-calc">
        <Tabs defaultActiveKey="1" items={items} onChange={handleChange} />
      </Card>
    </>
  );
};

export default OperationLog;
