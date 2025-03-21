import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { updateCollapse } from "@/store/statusSlice";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

const MainContainer: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const collapsed = useSelector((state: any) => state.status.collapsed);

  return (
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }}>
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
      </Header>
      {/* <Content
        style={{
          margin: 0,
          padding: 0,
          minHeight: 280,
        }}
      >
        <Content
          style={{
            margin: 16,
            padding: 16,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Content> */}
      <Content
        style={{
          margin: 16,
          // padding: 16,
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
