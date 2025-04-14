import React, { useEffect, useState } from "react";
import { Menu, Layout, theme } from "antd";
import type { MenuProps } from "antd";
import {
  BarChartOutlined,
  DatabaseOutlined,
  FundViewOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import Logo from "@/components/Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate, useLocation } from "react-router-dom";
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

const updateLocationMap = new Map<string, string>([
  ["cloud-setup", "1"],
  ["bucket-management", "2"],
  ["file-management", "2"],
  ["data-monitoring", "3"],
  ["operation-log", "4"],
]);

const CloudSider: React.FC = () => {
  const [defaultPath, setDefault] = useState<string>();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const collapsed = useSelector((state: RootState) => state.status.collapsed);
  const handleClick: MenuProps["onClick"] = (e: any) => {
    const path = routerMap.get(e.key) || "";
    navigate(path);
  };
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname;
    for (const key of updateLocationMap.keys()) {
      if (pathname.includes(key)) {
        setDefault(updateLocationMap.get(key));
        break;
      }
    }
  }, [location]);

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
      {defaultPath && (
        <Menu
          style={{
            fontSize: "16px",
          }}
          mode="inline"
          defaultSelectedKeys={[defaultPath]}
          items={menu}
          onClick={handleClick}
        ></Menu>
      )}
    </Sider>
  );
};

export default CloudSider;
