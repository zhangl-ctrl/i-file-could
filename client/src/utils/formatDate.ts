import dayjs from "dayjs";

type Option = {
  timestamp?: boolean;
  format?: string;
};

export default function formatDate(
  date: Date | string | number,
  option?: Option
) {
  // 判断是否是时间戳
  if (option && option.timestamp && typeof date === "number") {
    date = date / 10000;
  }
  // 如果传递了时间格式
  if (option && option.format) {
    return dayjs(date).format(option.format);
  }
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}
