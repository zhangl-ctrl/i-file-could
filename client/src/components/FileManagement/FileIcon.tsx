import React from "react";
import aac from "@/assets/images/files/aac.png";
import asp from "@/assets/images/files/asp.png";
import csv from "@/assets/images/files/csv.png";
import dir from "@/assets/images/files/dir.png";
import diropen from "@/assets/images/files/diropen.png";
import doc from "@/assets/images/files/doc.png";
import docx from "@/assets/images/files/docx.png";
import flac from "@/assets/images/files/flac.png";
import gif from "@/assets/images/files/gif.png";
import html from "@/assets/images/files/html.png";
import jpg from "@/assets/images/files/jpg.png";
import js from "@/assets/images/files/js.png";
import m4a from "@/assets/images/files/m4a.png";
import midi from "@/assets/images/files/midi.png";
import mkv from "@/assets/images/files/mkv.png";
import mp2 from "@/assets/images/files/mp2.png";
import mp3 from "@/assets/images/files/mp3.png";
import mp4 from "@/assets/images/files/mp4.png";
import ogg from "@/assets/images/files/ogg.png";
import ogv from "@/assets/images/files/ogv.png";
import pdf from "@/assets/images/files/pdf.png";
import php from "@/assets/images/files/php.png";
import png from "@/assets/images/files/png.png";
import ppt from "@/assets/images/files/ppt.png";
import pptx from "@/assets/images/files/pptx.png";
import rar from "@/assets/images/files/rar.png";
import svg from "@/assets/images/files/svg.png";
import txt from "@/assets/images/files/txt.png";
import wav from "@/assets/images/files/wav.png";
import webm from "@/assets/images/files/webm.png";
import webp from "@/assets/images/files/webp.png";
import xls from "@/assets/images/files/xls.png";
import xlsx from "@/assets/images/files/xlsx.png";
import zip from "@/assets/images/files/zip.png";
import defaultImg from "@/assets/images/files/default.png";
import type { TableFile } from "./FileList";

const iconMap = new Map([
  ["aac", aac],
  ["asp", asp],
  ["csv", csv],
  ["dir", dir],
  ["diropen", diropen],
  ["doc", doc],
  ["docx", docx],
  ["bmp", png],
  ["flac", flac],
  ["gif", gif],
  ["html", html],
  ["jpg", jpg],
  ["js", js],
  ["m4a", m4a],
  ["midi", midi],
  ["mkv", mkv],
  ["mp2", mp2],
  ["mp3", mp3],
  ["mp4", mp4],
  ["mov", mp4],
  ["ogg", ogg],
  ["ogv", ogv],
  ["pdf", pdf],
  ["php", php],
  ["png", png],
  ["ppt", ppt],
  ["pptx", pptx],
  ["rar", rar],
  ["svg", svg],
  ["txt", txt],
  ["wav", wav],
  ["webm", webm],
  ["webp", webp],
  ["xls", xls],
  ["xlsx", xlsx],
  ["zip", zip],
  ["7z", zip],
  ["", defaultImg],
]);

const FileIcon: React.FC<{
  filename: string;
  isFolder: boolean;
  subItem?: TableFile[] | null;
}> = ({ filename, isFolder, subItem }) => {
  let extensionArr: Array<string> = filename.split(".");
  let extension: string = "";
  if (extensionArr.length > 1) {
    extension = filename.split(".").at(-1) || "";
  } else if (extensionArr.length === 1) {
    extension = "";
  }

  return isFolder ? (
    subItem && subItem.length > 0 ? (
      <img
        src={iconMap.get("diropen")}
        className="w-[20px] h-[20px] mr-[4px]"
        alt="文件夹"
      />
    ) : (
      <img
        src={iconMap.get("dir")}
        className="w-[20px] h-[20px] mr-[4px]"
        alt="文件夹"
      />
    )
  ) : (
    <img
      src={iconMap.get(extension.toLowerCase())}
      className="w-[20px] h-[20px] mr-[4px]"
      alt="文件"
    />
  );
};

export default FileIcon;
