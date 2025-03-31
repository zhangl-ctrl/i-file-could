import dayjs from "dayjs";

export default function formatDate(date: Date | string | number) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}
