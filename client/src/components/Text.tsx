import React from "react";

const Text: React.FC<{ text: string | number }> = ({ text }) => {
  return <span className="text-[14px] text-[#8c8c8c]">{text}</span>;
};

export default Text;
