import { HttpService, Inject, Injectable } from '@nestjs/common';
import {
  QueueConfig,
  QueueResponse,
  QueueRequestContainer,
} from '../interfaces';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { rateLimit } from "../rxjs";
import { v4 as uuidv4 } from 'uuid';
import { AxiosRequestConfig, AxiosResponse } from "axios";

@Injectable()
export class HttpQueueService {
  private queueSubjects: Map<
    string,
    BehaviorSubject<QueueRequestContainer>
  > = new Map();
  private response$Map: Map<string, Observable<QueueResponse>> = new Map();
  private readonly config: QueueConfig = {
    default: {
      maxRequests: 10,
      timespan: 10000,
    },
  };

  public get currentActiveRules(): number {
    return Array.from(this.queueSubjects.keys()).length;
  }

  constructor(
    @Inject('QUEUE_CONFIG') _queueConfig: QueueConfig,
    private http: HttpService,
  ) {
    this.config = { ...this.config, ..._queueConfig };
  }

  private doRequest<T>(
    fn: () => Observable<any>,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const uuid = uuidv4();

    return this.queueRequest(rule, { fn, uuid, rule }).pipe(
      filter((value) => value.uuid === uuid),
      take(1),
      map(({ response }) => response),
    );
  }

  private queueRequest(rule: string, subjectValue: QueueRequestContainer) {
    let subject = this.queueSubjects.get(rule);
    let response$ = this.response$Map.get(rule);

    if (!subject || !response$) {
      subject = new BehaviorSubject<QueueRequestContainer>({
        fn: () => EMPTY,
        uuid: '',
        rule: '',
      });

      const limiterRule = this.config.rules?.[rule] || this.config.default;

      response$ = subject.pipe(
        rateLimit(limiterRule.maxRequests, limiterRule.timespan),
        switchMap((data) =>
          data.fn().pipe(map((response) => ({ ...data, response }))),
        ),
      );

      this.queueSubjects.set(rule, subject);
      this.response$Map.set(rule, response$);
    }

    subject.next(subjectValue);

    return response$;
  }

  public request<T = any>(
    config: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.request(config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.get(url, config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.delete(url, config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }

  public head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.head(url, config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }

  public post<T = any>(
    url: string,
    postData?: any,
    config?: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.post(url, postData, config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }

  public put<T = any>(
    url: string,
    putData?: any,
    config?: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.put(url, putData, config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }

  public patch<T = any>(
    url: string,
    patchData?: any,
    config?: AxiosRequestConfig,
    rule = 'rule',
  ): Observable<AxiosResponse<T>> {
    const reqFn = () =>
      this.http.patch(url, patchData, config).pipe(
        map(({ data, status, statusText, headers }) => ({
          data,
          status,
          statusText,
          headers,
        })),
      );
    return this.doRequest<T>(reqFn, rule);
  }
}
