import { useRoutes } from "react-router-dom";
import router from "./router";

const App = () => {
  const outlet = useRoutes(router);
  return (
    <>
      <div>{outlet}</div>
    </>
  );
};

export default App;
