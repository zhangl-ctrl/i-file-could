import router from "./router";
import i18n from "./i18n/config";
import { useRoutes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

const App = () => {
  const outlet = useRoutes(router);
  return <I18nextProvider i18n={i18n}>{outlet}</I18nextProvider>;
};

export default App;
