import { Observable } from "rxjs";

export interface QueueRequestContainer {
  fn: () => Observable<any>;
  uuid: string;
  rule?: string;
}