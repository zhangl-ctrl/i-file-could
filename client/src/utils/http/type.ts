// 定义业务响应数据格式（根据实际后端接口调整）
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}

// 定义类配置参数
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}
