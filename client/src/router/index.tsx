import { Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import FileManagement from "../pages/FileManagement";
import BucketManagement from "../pages/BucketManagement";
import CloudSetup from "../pages/CloudSetup";
import DataMonitoring from "../pages/DataMonitoring";
import OperationLog from "../pages/OperationLog";

export default [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        name: "文件管理",
        element: <Navigate to="file-management" />,
      },
      {
        path: "file-management",
        name: "文件管理",
        element: <FileManagement />,
      },
      {
        path: "bucket-management",
        name: "存储桶管理",
        element: <BucketManagement />,
      },
      {
        path: "cloud-setup",
        name: "云服务设置",
        element: <CloudSetup />,
      },
      {
        path: "data-monitoring",
        name: "数据监控",
        element: <DataMonitoring />,
      },
      {
        path: "operation-log",
        name: "操作日志",
        element: <OperationLog />,
      },
    ],
  },
];
