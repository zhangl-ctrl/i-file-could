import { nanoid } from "nanoid";
import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { PlusSquareOutlined, DownOutlined } from "@ant-design/icons";
import { Card, Input, Button, Row, Col, Space, Dropdown } from "antd";
import FileIcon from "@/components/FileManagement/FileIcon";
import type { MenuProps } from "antd";

export type TableFile = {
  id: number;
  name: string;
  isFolder: boolean;
  size: string | null;
  fileType: string | null;
  bucketType: string | null;
  lastUpdated: string | null;
  children: TableFile[] | null;
};
type Crumbs = {
  id: string;
  title: string;
  files: TableFile[];
};
const { Search } = Input;
const files: TableFile[] = [
  {
    id: 1,
    name: "文件夹1",
    isFolder: true,
    size: null,
    fileType: null,
    bucketType: null,
    lastUpdated: null,
    children: [
      {
        id: 2,
        name: "1.png",
        isFolder: false,
        size: "1024 kb",
        fileType: "image/jpeg",
        bucketType: "标准存储",
        lastUpdated: "2025-03-19 21:13:56",
        children: null,
      },
      {
        id: 3,
        name: "2.png",
        isFolder: false,
        size: "542 kb",
        fileType: "image/jpeg",
        bucketType: "标准存储",
        lastUpdated: "2025-02-25 10:57:51",
        children: null,
      },
      {
        id: 4,
        name: "文件夹1-1",
        isFolder: true,
        size: null,
        fileType: null,
        bucketType: null,
        lastUpdated: null,
        children: [
          {
            id: 5,
            name: "3.png",
            isFolder: false,
            size: "985 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 13:45:20",
            children: null,
          },
          {
            id: 6,
            name: "4.png",
            isFolder: false,
            size: "985 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 13:45:20",
            children: null,
          },
          {
            id: 7,
            name: "文件夹1-1-1",
            isFolder: true,
            size: null,
            fileType: null,
            bucketType: null,
            lastUpdated: null,
            children: [
              {
                id: 8,
                name: "5.png",
                isFolder: false,
                size: "542 kb",
                fileType: "image/jpeg",
                bucketType: "标准存储",
                lastUpdated: "2025-02-25 10:57:51",
                children: null,
              },
              {
                id: 9,
                name: "6.png",
                isFolder: false,
                size: "985 kb",
                fileType: "image/jpeg",
                bucketType: "标准存储",
                lastUpdated: "2025-02-25 13:45:20",
                children: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 10,
    name: "文件夹2",
    isFolder: true,
    size: null,
    fileType: null,
    bucketType: null,
    lastUpdated: null,
    children: [
      {
        id: 11,
        name: "文件夹2-1",
        isFolder: true,
        size: null,
        fileType: null,
        bucketType: null,
        lastUpdated: null,
        children: [
          {
            id: 12,
            name: "7.png",
            isFolder: false,
            size: "19289 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-03-19 21:13:12",
            children: null,
          },
          {
            id: 13,
            name: "8.png",
            isFolder: false,
            size: "542 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 10:57:51",
            children: null,
          },
        ],
      },
      {
        id: 14,
        name: "2.png",
        isFolder: false,
        size: "19289 kb",
        fileType: "image/jpeg",
        bucketType: "标准存储",
        lastUpdated: "2025-03-19 21:13:12",
        children: null,
      },
    ],
  },
  {
    id: 15,
    name: "文件夹3",
    isFolder: true,
    size: null,
    fileType: null,
    bucketType: null,
    lastUpdated: null,
    children: [
      {
        id: 16,
        name: "9.png",
        isFolder: false,
        size: "19289 kb",
        fileType: "image/jpeg",
        bucketType: "标准存储",
        lastUpdated: "2025-03-19 21:13:12",
        children: null,
      },
      {
        id: 17,
        name: "10.png",
        isFolder: false,
        size: "19289 kb",
        fileType: "image/jpeg",
        bucketType: "标准存储",
        lastUpdated: "2025-03-19 21:13:12",
        children: null,
      },
      {
        id: 18,
        name: "文件夹3-1",
        isFolder: true,
        size: null,
        fileType: null,
        bucketType: null,
        lastUpdated: null,
        children: [
          {
            id: 19,
            name: "11.png",
            isFolder: false,
            size: "19289 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-03-19 21:13:12",
            children: null,
          },
          {
            id: 20,
            name: "12.png",
            isFolder: false,
            size: "19289 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-03-19 21:13:12",
            children: null,
          },
        ],
      },
    ],
  },
  {
    id: 21,
    name: "文件夹4",
    isFolder: true,
    size: null,
    fileType: null,
    bucketType: null,
    lastUpdated: null,
    children: [
      {
        id: 22,
        name: "文件夹4-1",
        isFolder: true,
        size: null,
        fileType: null,
        bucketType: null,
        lastUpdated: null,
        children: [
          {
            id: 23,
            name: "13.png",
            isFolder: false,
            size: "542 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 10:57:51",
            children: null,
          },
          {
            id: 24,
            name: "14.png",
            isFolder: false,
            size: "542 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 10:57:51",
            children: null,
          },
        ],
      },
      {
        id: 25,
        name: "文件夹4-2",
        isFolder: true,
        size: null,
        fileType: null,
        bucketType: null,
        lastUpdated: null,
        children: [
          {
            id: 26,
            name: "15.png",
            isFolder: false,
            size: "542 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 10:57:51",
            children: null,
          },
          {
            id: 27,
            name: "16.png",
            isFolder: false,
            size: "542 kb",
            fileType: "image/jpeg",
            bucketType: "标准存储",
            lastUpdated: "2025-02-25 10:57:51",
            children: null,
          },
        ],
      },
    ],
  },
  {
    id: 28,
    name: "背景图.png",
    isFolder: false,
    size: "19289 kb",
    fileType: "image/jpeg",
    bucketType: "标准存储",
    lastUpdated: "2025-03-19 21:13:12",
    children: null,
  },
  {
    id: 29,
    name: "文件夹10086",
    isFolder: true,
    size: null,
    fileType: null,
    bucketType: null,
    lastUpdated: null,
    children: null,
  },
];
const tableColumns = [
  {
    id: 1,
    title: "文件名",
    width: 10,
  },
  {
    id: 2,
    title: "文件大小",
    width: 2,
  },
  {
    id: 3,
    title: "文件类型",
    width: 2,
  },
  {
    id: 4,
    title: "存储类型",
    width: 2,
  },
  {
    id: 5,
    title: "最近更新",
    width: 4,
  },
  {
    id: 6,
    title: "操作",
    width: 4,
  },
];

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "查看",
  },
  {
    key: "2",
    label: "删除",
  },
];

const Crumbs = ({
  crumbs,
  onUpdatecrumbs,
}: {
  crumbs: any;
  onUpdatecrumbs: Function;
}) => {
  const handleNavigateCrumbs = (path: Crumbs) => {
    onUpdatecrumbs(path);
  };
  return (
    <div>
      {(crumbs || []).map((path: any, index: number) => {
        return (
          <Fragment key={index}>
            <span
              className="hover:text-[#1677ff] cursor-pointer"
              onClick={() => handleNavigateCrumbs(path)}
            >
              {path.title}
            </span>
            {index === crumbs.length - 1 ? "" : " / "}
          </Fragment>
        );
      })}
    </div>
  );
};

const FileList: React.FC = () => {
  const [currentFileList, setCurrentFileList] = useState<TableFile[] | null>(
    files
  );
  const [crumbs, setCrumbs] = useState<Crumbs[]>([]);
  const handlePreviewFile = (file: TableFile) => {
    if (file.isFolder) {
      setCurrentFileList(file.children);
      const id = nanoid();
      setCrumbs([
        ...crumbs,
        { id, title: file.name, files: file.children || [] },
      ]);
    }
  };
  const handleUpdatecrumbs = (path: Crumbs) => {
    setCurrentFileList(path.files);
    const index = crumbs.findIndex((item) => item.id === path.id);
    const filterCrumbs = crumbs.slice(0, index + 1);
    setCrumbs(filterCrumbs);
  };
  useEffect(() => {
    const id = nanoid();
    setCrumbs([{ id, title: "根目录", files }]);
  }, []);

  return (
    <Card>
      <div className="flex justify-between">
        <Space align="center">
          <span className="font-semibold text-[16px]">文件列表</span>
          <Crumbs crumbs={crumbs} onUpdatecrumbs={handleUpdatecrumbs} />
        </Space>
        <div className="w-[330px] flex justify-between">
          <Search placeholder="请输入文件名" style={{ width: 200 }} />
          <Button type="primary" icon={<PlusSquareOutlined />}>
            新建文件夹
          </Button>
        </div>
      </div>
      <div className="mt-[16px]">
        <Row className="bg-[#f5f5f5] h-10 leading-10 px-2 box-border">
          {tableColumns.map((column) => {
            return (
              <Fragment key={column.id}>
                <Col span={column.width}>
                  <span className="text-[12px] font-bold">{column.title}</span>
                </Col>
              </Fragment>
            );
          })}
        </Row>
        {(currentFileList || []).map((file) => {
          return (
            <Fragment key={file.id}>
              <Row
                className="h-10 leading-10 px-2 box-border cursor-pointer hover:bg-[#f8f8f8]"
                onDoubleClick={() => handlePreviewFile(file)}
              >
                <Col span={10} className="hover:text-[#1677ff]">
                  <div className="flex items-center">
                    <FileIcon
                      filename={file.name}
                      isFolder={file.isFolder}
                      subItem={file.children || []}
                    />
                    <span>{file.name}</span>
                  </div>
                </Col>
                <Col span={2}>{file.size}</Col>
                <Col span={2}>{file.fileType}</Col>
                <Col span={2}>{file.bucketType}</Col>
                <Col span={4}>{file.lastUpdated}</Col>
                <Col span={4}>
                  <Space>
                    <span className="text-[#1677ff]">详情</span>
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <span>更多</span>
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </Fragment>
          );
        })}
      </div>
    </Card>
  );
};

export default FileList;
