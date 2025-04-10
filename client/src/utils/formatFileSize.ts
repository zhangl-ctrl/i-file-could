const sizeMap: Record<number, string> = {
  0: "B",
  1: "KB",
  2: "MB",
  3: "G",
  4: "T",
};

export default function formatFileSize(size: number | string) {
  size = Number(size);
  let index: number = 0;
  while (size > 1024) {
    size = size / 1024;
    index++;
  }
  return size.toFixed(2) + sizeMap[index];
}
