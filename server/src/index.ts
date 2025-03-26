import { createApp } from "./app";

const app = createApp();
// const PORT = process.env.PORT || 3005;
const PORT = 3006;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
