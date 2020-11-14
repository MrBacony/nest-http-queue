import {
  asyncScheduler,
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  timer,
} from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';

/**
 * rate Limit Operator for RxJS Observables.
 *
 * Usage:
 * a pipe operator with rateLimit(10, 10000) lets us do 10 requests in 10 seconds
 *
 * Credits to:
 * Jonathan Faircloth (https://www.faircloth.xyz/3-ways-make-multiple-http-requests-rxjs/)
 * Gergely Sipos (https://aliz.ai/rate-limiting-in-rxjs/ and https://github.com/gsipos/rxjs-ratelimit)
 *
 * @param maxRequests Maximum Requests
 * @param timespan Timespan within maximum requests could be done
 * @param scheduler
 */
export function rateLimit<T>(
  maxRequests: number,
  timespan: number,
  scheduler = asyncScheduler,
): MonoTypeOperatorFunction<T> {
  let tokens = maxRequests;
  const tokenChanged = new BehaviorSubject(tokens);
  const consumeToken = () => tokenChanged.next(--tokens);
  const renewToken = () => tokenChanged.next(++tokens);

  const availableTokens$ = tokenChanged.pipe(filter(() => tokens > 0));

  return mergeMap<T, Observable<T>>((value: T) =>
    availableTokens$.pipe(
      take(1),
      map(() => {
        consumeToken();
        timer(timespan, scheduler).subscribe(renewToken);
        return value;
      }),
    ),
  );
}
