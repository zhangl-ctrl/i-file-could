import React, { useEffect } from "react";
import router from "./router";
import i18n from "./i18n/config";
import { useRoutes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { setQiniuServiceKey } from "@/store/cloudServiceSlice";
import { useDispatch } from "react-redux";

const App: React.FC = () => {
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
  // window.addEventListener("load", function () {
  //   setTimeout(function () {
  //     var timing = window.performance.timing;
  //     var loadTime = timing.loadEventEnd - timing.navigationStart;
  //     var pageUrl = window.location.href;
  //     console.log(
  //       "Page load time for " + pageUrl + " is " + loadTime + " milliseconds."
  //     );
  //   }, 0);
  // });

  return <I18nextProvider i18n={i18n}>{outlet}</I18nextProvider>;
};

export default App;
