import { Image } from "antd";
import React, { useEffect, useRef } from "react";
import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default ({
  filePath,
  fileType,
}: {
  filePath: string;
  fileType: string;
}) => {
  // const
  console.log("filePath", filePath);
  console.log("fileType", fileType);
};
