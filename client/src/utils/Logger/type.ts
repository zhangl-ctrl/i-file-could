export interface DataType {
  id?: string;
  key?: string;
  method?: string;
  eventName?: string;
  status?: string;
  infoType?: string;
  // path?: string;
  date?: string | number;
  env?: string;
  couldService?: string;
  errorMsg?: any;
  detail?: string;
  network_path?: string;
  network_organ?: string;
  event_name?: string;
  url?: string;
  statusCode?: number;
  message?: string;
  response?: Record<string, any>;
  cloudService?: string;
  stack?: any;
}
