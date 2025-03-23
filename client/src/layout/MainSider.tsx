import React from "react";
import { Menu, Layout, theme } from "antd";
import type { MenuProps } from "antd";
import {
  BarChartOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FundViewOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import Logo from "@/components/Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;

const Text: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation("common");
  return <>{t(text)}</>;
};

const menu = [
  {
    key: "1",
    icon: <CloudServerOutlined />,
    label: <Text text="cloudVendorManagement" />,
    path: "cloud-setup",
  },
  {
    key: "2",
    icon: <DatabaseOutlined />,
    label: <Text text="bucketManagement" />,
    path: "bucket-management",
  },
  {
    key: "3",
    icon: <BarChartOutlined />,
    label: <Text text="dataMonitoring" />,
    path: "data-monitoring",
  },
  {
    key: "4",
    icon: <FundViewOutlined />,
    label: <Text text="operationLog" />,
    path: "operation-log",
  },
];

const routerMap = new Map<string, string>([
  ["1", "cloud-setup"],
  ["2", "bucket-management"],
  ["3", "data-monitoring"],
  ["4", "operation-log"],
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
      width={260}
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{ background: colorBgContainer }}
    >
      <div className="flex justify-center">
        <Logo />
      </div>
      <Menu
        style={{
          fontSize: "16px",
        }}
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menu}
        onClick={handleClick}
      ></Menu>
    </Sider>
  );
};

export default CloudSider;
