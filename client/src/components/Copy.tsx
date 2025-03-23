import React from "react";
import { message } from "antd";
import { CopyFilled } from "@ant-design/icons";

const Copy: React.FC<{ text: string }> = ({ text }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      messageApi.open({
        type: "success",
        content: "复制成功",
      });
    });
  };
  return (
    <>
      {contextHolder}
      <CopyFilled
        className="text-[20px] !text-[#aaa] ml-[10px] cursor-pointer !active:text-[#ccc]"
        onClick={handleCopy}
      />
    </>
  );
};

export default Copy;
