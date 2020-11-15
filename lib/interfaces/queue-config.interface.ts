import { LimiterRule } from "./limiter-rule.interface";

export interface QueueConfig {
  rules?: {
    [key: string]: LimiterRule;
  };
  default?: LimiterRule;
}