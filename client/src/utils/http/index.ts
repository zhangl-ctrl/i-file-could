import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResponse, HttpClientConfig } from "./type";

class Http {
  private instance: AxiosInstance;
  private readonly config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = config;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...config.headers,
      },
    });
    this.initInterceptors();
  }

  private initInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.handleRequest(config),
      (error: AxiosError) => this.handleRequestError(error)
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.handleResponse(response),
      (error: AxiosError) => this.handleResponseError(error)
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig) {
    // 添加 token 逻辑
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 处理 FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  }

  private handleRequestError(error: AxiosError) {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }

  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>) {
    const res = response.data;
    if (res.code === 200) {
      return res.data;
    } else {
      return Promise.reject(new Error(res.message || "Request failed"));
    }
  }

  private handleResponseError(error: AxiosError) {
    if (error.response) {
      const status = error.response.status;
      let message = "";

      switch (status) {
        case 400:
          message = "请求错误";
          break;
        case 401:
          message = "身份验证失败";
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = "资源不存在";
          break;
        case 500:
          message = "服务器错误";
          break;
        default:
          message = `网络错误（${status}）`;
      }
      console.error(`[HTTP Error] ${message}`);
    } else if (error.request) {
      console.error("Network Error:" + error.message);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }

  // 通用请求方法
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.delete(url, { params, ...config });
  }

  public upload<T = any>(
    url: string,
    file: File,
    fileName: string = "file"
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fileName, file);
    return this.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

const http = new Http({
  baseURL: "http://localhost:3006",
  timeout: 15000,
});

export default http;
