import { Observable } from 'rxjs';

export interface LimiterRule {
  maxRequests: number;
  timespan: number;
}

export type QueueRequest = () => Observable<any>;

export interface QueueRequestContainer {
  fn: QueueRequest;
  uuid: string;
  rule?: string;
}

export interface QueueResponse extends QueueRequestContainer {
  response: HttpQueueResponse<any>;
}

export interface QueueConfig {
  rules?: {
    [key: string]: LimiterRule;
  };
  default?: LimiterRule;
}

export interface HttpQueueResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}
