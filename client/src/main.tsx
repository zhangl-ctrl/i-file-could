import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import "dayjs/locale/zh-cn";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
