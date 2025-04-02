import router from "./router";
import i18n from "./i18n/config";
import { useRoutes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getQiniuToken } from "@/api/qiniuService";
import { setQiniuToken, setQiniuServiceKey } from "@/store/cloudServiceSlice";
import { useDispatch } from "react-redux";

const App = () => {
  const outlet = useRoutes(router);
  const dispatch = useDispatch();
  // 初始化 token
  useEffect(() => {
    const qiniuKey = localStorage.getItem("qiniuKey");
    if (qiniuKey) {
      const { accessKey, secretKey } = JSON.parse(qiniuKey);
      dispatch(setQiniuServiceKey({ accessKey, secretKey }));
    }
  }, []);
  return <I18nextProvider i18n={i18n}>{outlet}</I18nextProvider>;
};

export default App;
