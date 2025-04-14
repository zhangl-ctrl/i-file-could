import { nanoid } from "nanoid";
import React from "react";
import { useState, useEffect, Fragment } from "react";
import {
  PlusSquareOutlined,
  DownOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Card,
  Input,
  Button,
  Row,
  Col,
  Space,
  Dropdown,
  Spin,
  Modal,
  message,
} from "antd";
import FileIcon from "@/components/FileManagement/FileIcon";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getQiniuFilelist } from "@/api/qiniuService";
import formatFileSize from "@/utils/formatFileSize";
import { STORAGE_TYPE } from "@/common/cloudService";
import formatDate from "@/utils/formatDate";
import { updateCrumbs } from "@/store/statusSlice";
import qiniuManger from "@/utils/qiniuManger";
import noFileListImg from "@/assets/images/空空如也.svg";
import FileDetail from "@/components/FileDetail";

type FileInfo = Record<string, string>;
type Crumbs = {
  id: string;
  title: string;
  files: TableFile;
};
type NameStatus = "error" | "warning" | "";
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

// const { Search } = Input;

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
    label: "下载",
  },
  {
    key: "2",
    label: "删除",
  },
];

const directoryRegex = /^(?!^\.+$)(?!.*[\s/])[^\s/]+$/;

const FileList: React.FC = () => {
  const dispatch = useDispatch();
  // 获取存储桶名字
  const { bucket } = useParams();
  // 翻译函数
  const { t } = useTranslation("common");
  const [messageApi, contextHolder] = message.useMessage();
  const [loadding, setLoadding] = useState<boolean>(false);
  // 保存面包屑
  const [crumbs, setCrumbs] = useState<Crumbs[]>([]);
  const [hasFile, setHasFile] = useState<boolean>(true);
  const [currentFolder, setCurrentFolder] = useState<string[]>(["root/"]);
  const [showDirectoryModal, setShowDirectoryModal] = useState<boolean>(false);
  const [directory, setDirectory] = useState<string>("");
  const [directoryStatus, setDirectoryStatus] = useState<NameStatus>("");
  const [createDirLoadding, setCreateDirLoadding] = useState<boolean>(false);
  const [fileDrawer, setFileDrawer] = useState<boolean>(false);
  const [priviewFile, setPriviewFile] = useState<Record<string, any>>();
  // 当前存储桶内的文件
  const [currentFileList, setCurrentFileList] = useState<TableFile>();
  // 获取密钥
  const { accessKey, secretKey } = useSelector(
    (state: any) => state.cloudService.qiniuService
  );
  const currentCrumbs = useSelector((state: any) => state.status.currentCrumbs);
  const token = useSelector(
    (state: any) =>
      state.cloudService.qiniuService.bucketTokens[bucket as string]?.token
  );

  // 获取文件列表
  const handleGetQiniuFilelist = (bucket: string) => {
    setLoadding(true);
    getQiniuFilelist(accessKey, secretKey, bucket).then(async (res: any) => {
      res.data.files = res.data.files.map((file: Record<string, any>) => {
        file.fileName = file.key;
        return file;
      });
      setCurrentFileList(res.data);
      setLoadding(false);
    });
  };
  // 点击文件夹
  const handlePreviewDirectory = (directory: TableFile) => {
    const pathStr = currentFolder.slice(1).join("") + directory.name;
    directory.files = directory.files.filter((file) => file.key !== pathStr);
    directory.files.forEach((file) => {
      file.fileName = file.key.replace(pathStr, "");
      // file.key = file.key.replace(pathStr, "");
    });
    directory.folders.forEach((folderItem) => {
      folderItem.name = folderItem.name.replace(pathStr, "");
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
    dispatch(updateCrumbs([...currentCrumbs, directory.name]));
  };
  // 点击面包屑更新文件列表
  const handleUpdatecrumbs = (path: Crumbs) => {
    const index = crumbs.findIndex((item) => item.id === path.id);
    const filterCrumbs = crumbs.slice(0, index + 1);
    const crumbsList = filterCrumbs.map((item) => item.title);
    dispatch(updateCrumbs(crumbsList));
    setCrumbs(filterCrumbs);
    setCurrentFileList(path.files);
    setCurrentFolder(currentFolder.slice(0, index + 1));
  };
  // 刷新文件列表
  const handleRefreshList = () => {
    if (accessKey && secretKey && bucket) {
      handleGetQiniuFilelist(bucket);
    }
  };
  // 点击新建文件夹按钮
  const handleCreateDirectory = () => {
    setShowDirectoryModal(true);
  };
  // 新建文件夹点击确认
  const handleConfirm = () => {
    if (!directory) {
      setDirectoryStatus("error");
      return;
    }
    setDirectoryStatus("");
    setDirectory("");
    setCreateDirLoadding(true);
    const currentDirectory = currentCrumbs.slice(1).join("");
    const key = currentDirectory + directory;
    const createDirectory = qiniuManger.createDirectory(key, token);
    createDirectory.observer({
      next(_: any) {},
      error(err: Error) {
        setCreateDirLoadding(false);
        setShowDirectoryModal(false);
        messageApi.error(err.message);
      },
      complete(_: any) {
        setCreateDirLoadding(false);
        setShowDirectoryModal(false);
        messageApi.success("新建成功");
        handleRefreshList();
      },
    });
  };
  const handleChangeDirectory = (e: any) => {
    setDirectory(e.target.value);
    if (!directoryRegex.test(e.target.value)) {
      setDirectoryStatus("error");
    } else {
      setDirectoryStatus("");
    }
  };
  // 新建文件夹弹窗点击取消或点击关闭
  const handleCancel = () => {
    setShowDirectoryModal(false);
    setDirectoryStatus("");
    setDirectory("");
  };
  // 获取文件详情
  const getFileDetail = async (file: any) => {
    setPriviewFile(file);
    setFileDrawer(true);
    // if (bucket) {
    //   const key = file.key;
    //   getQiniuFileDetail(accessKey, secretKey, bucket, key);
    // }
  };
  // 关闭文件详情
  const handleCloseFileDetail = () => {
    setFileDrawer(false);
  };
  // 获取文件列表
  useEffect(() => {
    if (accessKey && secretKey && bucket) {
      handleGetQiniuFilelist(bucket);
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
      dispatch(updateCrumbs(["root/"]));
    }
  }, [currentFileList]);

  return (
    <>
      <Spin spinning={loadding} size="large">
        <Card className="flex-auto">
          <div className="flex justify-between">
            <Space align="center">
              <span className="font-semibold text-[16px]">{t("fileList")}</span>
              <Crumbs crumbs={crumbs} onUpdatecrumbs={handleUpdatecrumbs} />
            </Space>
            <div className="flex justify-between">
              <Button
                icon={<UndoOutlined />}
                className="ml-[10px]"
                onClick={handleRefreshList}
              >
                刷新列表
              </Button>
              <Button
                type="primary"
                icon={<PlusSquareOutlined />}
                className="ml-[10px]"
                onClick={handleCreateDirectory}
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
                      <span className="text-[12px] font-bold">
                        {column.title}
                      </span>
                    </Col>
                  </Fragment>
                );
              })}
            </Row>
            {currentFileList &&
            (currentFileList.folders.length > 0 ||
              currentFileList.files.length > 0) ? (
              <div className="h-[750px] overflow-auto">
                {(currentFileList.folders || []).map((folder) => {
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
                })}
                {(currentFileList.files || []).map((file) => {
                  return (
                    <Fragment key={file.key}>
                      <Row className="h-10 leading-10 px-2 box-border cursor-text hover:bg-[#f8f8f8]">
                        <Col span={8}>
                          <div className="flex items-center">
                            <FileIcon
                              filename={file.fileName}
                              isFolder={false}
                            />
                            <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {file.fileName}
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
                        <Col span={5}>
                          {formatDate(Number(file.putTime) / 10000)}
                        </Col>
                        <Col span={2}>
                          <Space>
                            <span
                              className="text-[#1677ff] hover:text-[#69b1ff] cursor-pointer"
                              onClick={() => getFileDetail(file)}
                            >
                              {t("detail")}
                            </span>
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
            ) : (
              <div className="h-[750px] overflow-auto flex justify-center items-center flex-col">
                <img src={noFileListImg} className="w-[400px]" alt="暂无文件" />
                <div className="text-[18px] text-[#aaa]">暂无数据</div>
              </div>
            )}
          </div>
        </Card>
      </Spin>
      <Modal
        width={700}
        title="新建目录"
        open={showDirectoryModal}
        onCancel={handleCancel}
        onOk={handleConfirm}
      >
        <Spin spinning={createDirLoadding}>
          <Row className="mt-[20px]">
            <Col span={4}>
              目录名<span className="text-[#ff4d4f]">*</span>
            </Col>
            <Col span={20}>
              <Input
                placeholder="请输入目录名称"
                value={directory}
                onChange={handleChangeDirectory}
                status={directoryStatus}
              />
            </Col>
          </Row>
          {directoryStatus === "error" && (
            <Row className="mt-[10px]">
              <Col span={4}></Col>
              <Col span={20}>
                <span className="text-[#ff4d4f]">
                  目录名称格式错误，请重新输入
                </span>
              </Col>
            </Row>
          )}
          <Row className="mt-[10px] text-[#aaa]">
            <Col span={4}></Col>
            <Col span={20}>
              不支持仅由英文句号 . 组成的名称； 不能使用
              <span className="text-[#fa9426]"> / </span>
            </Col>
          </Row>
        </Spin>
      </Modal>
      {priviewFile && bucket && (
        <FileDetail
          showDrawer={fileDrawer}
          onClose={handleCloseFileDetail}
          file={priviewFile}
          bucket={bucket}
        />
      )}
      {contextHolder}
    </>
  );
};

export default FileList;
