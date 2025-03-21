import React from "react";
import { Layout } from "antd";
import MainSider from "@/components/MainSider";
import MainContainer from "@/components/MainContainer";

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <MainSider />
      <MainContainer />
    </Layout>
  );
};

export default MainLayout;
