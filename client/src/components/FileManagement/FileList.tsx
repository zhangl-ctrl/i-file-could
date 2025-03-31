import { nanoid } from "nanoid";
import React from "react";
import { useState, useEffect, Fragment } from "react";
import { PlusSquareOutlined, DownOutlined } from "@ant-design/icons";
import { Card, Input, Button, Row, Col, Space, Dropdown } from "antd";
import FileIcon from "@/components/FileManagement/FileIcon";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getQiniuFilelist } from "@/api/qiniuService";
import formatFileSize from "@/utils/formatFileSize";
import { STORAGE_TYPE } from "@/common/cloudService";
import formatDate from "@/utils/formatDate";

type FileInfo = Record<string, string>;
type Crumbs = {
  id: string;
  title: string;
  files: TableFile;
};
export type TableFile = {
  id: string;
  name: string;
  files: FileInfo[];
  folders: TableFile[];
};

const Text: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation("common");
  return <>{t(text)}</>;
};

// 面包屑组件
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
              {path.title.replace("/", "")}
            </span>
            {" / "}
          </Fragment>
        );
      })}
    </div>
  );
};

const { Search } = Input;

// 表格头部
const tableColumns = [
  {
    id: 1,
    title: <Text text="fileName" />,
    width: 8,
  },
  {
    id: 2,
    title: <Text text="fileSize" />,
    width: 3,
  },
  {
    id: 3,
    title: <Text text="fileType" />,
    width: 4,
  },
  {
    id: 4,
    title: <Text text="storageType" />,
    width: 2,
  },
  {
    id: 5,
    title: <Text text="lastUpdated" />,
    width: 5,
  },
  {
    id: 6,
    title: <Text text="operation" />,
    width: 2,
  },
];
// 文件操作
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

const FileList: React.FC = () => {
  // 获取存储桶名字
  const { bucket } = useParams();
  // 翻译函数
  const { t } = useTranslation("common");
  // 保存面包屑
  const [crumbs, setCrumbs] = useState<Crumbs[]>([]);
  const [hasFile, setHasFile] = useState<boolean>(true);
  const [currentFolder, setCurrentFolder] = useState<string[]>(["root/"]);
  // 当前存储桶内的文件
  const [currentFileList, setCurrentFileList] = useState<TableFile>();
  // 获取密钥
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );
  // 点击文件夹
  const handlePreviewDirectory = (directory: TableFile) => {
    const pathStr = currentFolder.slice(1).join("") + directory.name;
    directory.files = directory.files.filter((file) => file.key !== pathStr);
    directory.files.forEach((file) => {
      file.key = file.key.replace(pathStr, "");
    });
    directory.folders.forEach((folderItem) => {
      folderItem.name = folderItem.name.replace(directory.name, "");
    });
    setCurrentFileList(directory);
    setCurrentFolder([...currentFolder, directory.name]);
    // 设置面包屑
    const id = nanoid();
    setCrumbs([
      ...crumbs,
      {
        id,
        title: directory.name,
        files: directory,
      },
    ]);
  };
  // 点击面包屑更新文件列表
  const handleUpdatecrumbs = (path: Crumbs) => {
    const index = crumbs.findIndex((item) => item.id === path.id);
    const filterCrumbs = crumbs.slice(0, index + 1);
    setCrumbs(filterCrumbs);
    setCurrentFileList(path.files);
    setCurrentFolder(currentFolder.slice(0, index + 1));
  };
  // 获取文件列表
  useEffect(() => {
    if (accessKey && secretKey && bucket) {
      getQiniuFilelist(accessKey, secretKey, bucket).then(async (res: any) => {
        setCurrentFileList(res);
      });
    }
  }, [accessKey, secretKey]);

  useEffect(() => {
    // 初始化面包屑根目录，此函数只执行一次
    if (hasFile && currentFileList) {
      const id = nanoid();
      setCrumbs([
        ...crumbs,
        {
          id,
          title: "root/",
          files: currentFileList,
        },
      ]);
      setHasFile(false);
    }
  }, [currentFileList]);

  return (
    <Card className="flex-auto">
      <div className="flex justify-between">
        <Space align="center">
          <span className="font-semibold text-[16px]">{t("fileList")}</span>
          <Crumbs crumbs={crumbs} onUpdatecrumbs={handleUpdatecrumbs} />
        </Space>
        <div className="flex justify-between">
          <Search placeholder={t("enterFileName")} style={{ width: 200 }} />
          <Button
            type="primary"
            icon={<PlusSquareOutlined />}
            className="ml-[10px]"
          >
            {t("createFolder")}
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
        <div className="h-[750px] overflow-auto">
          {((currentFileList && currentFileList.folders) || []).map(
            (folder) => {
              return (
                <Fragment key={folder.id}>
                  <Row
                    className="h-10 leading-10 px-2 box-border cursor-pointer hover:bg-[#f8f8f8]"
                    onClick={() => handlePreviewDirectory(folder)}
                  >
                    <Col span={10} className="hover:text-[#1677ff]">
                      <div className="flex items-center">
                        <FileIcon
                          isFolder={true}
                          filename={folder.name}
                          subItem={folder.folders || []}
                        ></FileIcon>
                        <span>{folder.name}</span>
                      </div>
                    </Col>
                  </Row>
                </Fragment>
              );
            }
          )}
          {((currentFileList && currentFileList.files) || []).map((file) => {
            return (
              <Fragment key={file.key}>
                <Row className="h-10 leading-10 px-2 box-border cursor-text hover:bg-[#f8f8f8]">
                  <Col span={8}>
                    <div className="flex items-center">
                      <FileIcon filename={file.key} isFolder={false} />
                      <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {file.key}
                      </div>
                    </div>
                  </Col>
                  <Col span={3}>{formatFileSize(file.fsize)}</Col>
                  <Col span={4}>
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                      {file.mimeType}
                    </div>
                  </Col>
                  <Col span={2}>{STORAGE_TYPE[Number(file.type)]}</Col>
                  <Col span={5}>{formatDate(Number(file.putTime) / 10000)}</Col>
                  <Col span={2}>
                    <Space>
                      <span className="text-[#1677ff]">{t("detail")}</span>
                      <Dropdown menu={{ items }} trigger={["click"]}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Space>
                            <span>{t("more")}</span>
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
      </div>
    </Card>
  );
};

export default FileList;
