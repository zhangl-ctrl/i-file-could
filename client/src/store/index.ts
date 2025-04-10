import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// import statusSlice from "./statusSlice";
// import cloudServiceSlice from "./cloudServiceSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["status", "cloudService"], // 指定需要持久化的 reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // 忽略 redux-persist 的序列化警告
      },
    }),
});
const persistor = persistStore(store);
export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
