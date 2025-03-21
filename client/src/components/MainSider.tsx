import { Menu, Layout, theme } from "antd";
import {
  BarChartOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FundViewOutlined,
} from "@ant-design/icons";
import React from "react";
import Logo from "@/components/Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const menu = [
  {
    key: "1",
    icon: <FileTextOutlined />,
    label: "文件管理",
    path: "file-management",
  },
  {
    key: "2",
    icon: <DatabaseOutlined />,
    label: "存储桶管理",
    path: "bucket-management",
  },
  {
    key: "3",
    icon: <CloudServerOutlined />,
    label: "云服务存储",
    path: "cloud-setup",
  },
  {
    key: "4",
    icon: <BarChartOutlined />,
    label: "数据监控",
    path: "data-monitoring",
  },
  {
    key: "5",
    icon: <FundViewOutlined />,
    label: "操作日志",
    path: "operation-log",
  },
];

const routerMap = new Map<string, string>([
  ["1", "file-management"],
  ["2", "bucket-management"],
  ["3", "cloud-setup"],
  ["4", "data-monitoring"],
  ["5", "operation-log"],
]);

const CloudSider: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const collapsed = useSelector((state: RootState) => state.status.collapsed);
  const handleClick: MenuProps["onClick"] = (e: any) => {
    const path = routerMap.get(e.key) || "";
    navigate(path);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{ background: colorBgContainer }}
    >
      {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
      <div className="flex justify-center">
        <Logo />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menu}
        onClick={handleClick}
      ></Menu>
    </Sider>
  );
};

export default CloudSider;
