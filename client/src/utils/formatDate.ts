import dayjs from "dayjs";

export default function formatDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}
