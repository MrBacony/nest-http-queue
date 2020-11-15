import { QueueRequestContainer } from "./queue-request-container.interface";
import { AxiosResponse } from "axios";

export interface QueueResponse extends QueueRequestContainer {
  response: AxiosResponse;
}
