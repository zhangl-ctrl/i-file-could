import { createApp } from "./app";

const app = createApp();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// console.trace("当前 exit 监听器数量:", process.listenerCount("exit"));
