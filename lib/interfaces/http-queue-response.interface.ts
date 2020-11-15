export interface HttpQueueResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}
