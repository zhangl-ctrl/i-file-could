import React from "react";
import { Layout } from "antd";
import MainSider from "@/layout/MainSider";
import MainContainer from "@/layout/MainContainer";

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <MainSider />
      <MainContainer />
    </Layout>
  );
};

export default MainLayout;
