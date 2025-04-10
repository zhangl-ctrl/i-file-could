import { Image } from "antd";
import React, { useEffect } from "react";
import noImg from "@/assets/images/图片损坏.svg";
import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const imgType = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
  "image/apng",
  "image/avif",
];

const FilePreview: React.FC<{ filePath: string; fileType: string }> = ({
  filePath,
  fileType,
}) => {
  useEffect(() => {
    if (fileType !== "application/pdf") {
      import("./index.css");
    }
  }, [filePath]);
  if (!fileType || !filePath) {
    return (
      <div className="h-[400px] bg-[#f0f0f0] flex justify-center">
        <Image preview={false} src={noImg} height={400} />
      </div>
    );
  }
  if (imgType.includes(fileType)) {
    return (
      <div className="h-[400px] bg-[#f0f0f0] flex justify-center">
        <Image src={filePath} height={400} fallback={noImg} />
      </div>
    );
  }
  if (fileType.includes("audio")) {
    return (
      <div className="h-[100px] flex items-center">
        <audio src={filePath} controls />
      </div>
    );
  }
  if (fileType.includes("video")) {
    return (
      <div className="h-[400px] flex items-center">
        <video src={filePath} controls />
      </div>
    );
  }

  return (
    <DocViewer
      documents={[{ uri: filePath }]}
      pluginRenderers={DocViewerRenderers}
    />
  );
};

export default FilePreview;
