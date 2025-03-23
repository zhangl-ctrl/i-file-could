import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TranslationOutlined,
  GithubOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Outlet } from "react-router-dom";
import { updateCollapse } from "@/store/statusSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button, Layout, theme, Dropdown, Space } from "antd";
import { useTranslation } from "react-i18next";

const { Header, Content } = Layout;

const MainContainer: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_self"
          rel="noopener noreferrer"
          onClick={() => changeLanguage("zn")}
        >
          中文
        </a>
      ),
      icon: <ImportOutlined />,
    },
    {
      key: "2",
      label: (
        <a
          target="_self"
          rel="noopener noreferrer"
          onClick={() => changeLanguage("en")}
        >
          English
        </a>
      ),
      icon: <ImportOutlined />,
    },
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dispatch = useDispatch();
  const collapsed = useSelector((state: any) => state.status.collapsed);

  return (
    <Layout>
      <Header
        style={{ padding: 0, background: colorBgContainer }}
        className="flex justify-between"
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            dispatch(updateCollapse());
          }}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <div className="pr-[20px]">
          <Space size="middle">
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <TranslationOutlined className="text-[24px] !text-[#1e1e1e] cursor-pointer" />
              </a>
            </Dropdown>
            <a
              target="_blank"
              href="https://github.com/zhangl-ctrl/i-file-could/tree/master"
            >
              <GithubOutlined className="text-[24px] !text-[#1e1e1e] cursor-pointer"></GithubOutlined>
            </a>
          </Space>
        </div>
      </Header>
      <Content
        style={{
          margin: 16,
          minHeight: 280,
          // background: colorBgContainer,
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainContainer;
