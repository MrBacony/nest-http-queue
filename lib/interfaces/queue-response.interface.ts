import { HttpQueueResponse } from "./http-queue-response.interface";
import { QueueRequestContainer } from "./queue-request-container.interface";

export interface QueueResponse extends QueueRequestContainer {
  response: HttpQueueResponse<any>;
}
