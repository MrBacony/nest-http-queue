import { Test, TestingModule } from '@nestjs/testing';
import { HttpQueueService } from './http-queue.service';
import { HttpService } from '@nestjs/common';
import { of, range } from 'rxjs';

describe('HttpQueueService', () => {
  let service: HttpQueueService;
  let httpService: HttpService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpQueueService,
        {
          provide: 'QUEUE_CONFIG',
          useValue: {
            default: {
              maxRequests: 10,
              timespan: 1000,
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: () => {},
          },
        },
      ],
    }).compile();

    service = module.get<HttpQueueService>(HttpQueueService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('iterations', () => {
    [
      { cnt: 1, execRange: [0, 1] },
      { cnt: 10, execRange: [0, 1] },
      { cnt: 20, execRange: [1, 2] },
      { cnt: 30, execRange: [2, 3] },
    ].forEach((rangeCnt) => {
      it(`should fire ${rangeCnt.cnt} requests  (10 req per 1sec)`, (done) => {
        const result = {
          data: {},
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        };
        jest.spyOn(httpService, 'get').mockImplementation(() => of(result));

        const maxCnt = rangeCnt.cnt;
        const time = Date.now();
        range(1, maxCnt).subscribe((cnt) => {
          service.get('http://api.test.com').subscribe(() => {
            if (cnt === maxCnt) {
              const endTime = Date.now();
              expect((endTime - time) / 1000).toBeGreaterThan(
                rangeCnt.execRange[0],
              );
              expect((endTime - time) / 1000).toBeLessThan(
                rangeCnt.execRange[1],
              );
              done();
            }
          });
        });
      });
    });
  });

  describe('different rules', () => {
    it('should return one active rule with one request', () => {
      service.get('http://api.test.com');

      expect(service.currentActiveRules.length).toEqual(1);
    });

    it('should return one active rule with two requests', () => {
      service.get('http://api.test.com');
      service.get('http://api.test.com');

      expect(service.currentActiveRules.length).toEqual(1);
      expect(service.currentActiveRules[0]).toEqual('api.test.com');
    });

    it('should return one active rule with two requests', () => {
      service.get('http://api.test.com');
      service.get('http://api.test2.com');

      expect(service.currentActiveRules.length).toEqual(2);

      expect(service.currentActiveRules[0]).toEqual('api.test.com');
      expect(service.currentActiveRules[1]).toEqual('api.test2.com');
    });

    it('should return two active rules with two requests and different rulesets', () => {
      service.get('http://api.test.com', {}, 'rule1');
      service.get('http://api.test.com', {}, 'rule2');

      expect(service.currentActiveRules.length).toEqual(2);

      expect(service.currentActiveRules[0]).toEqual('rule1');
      expect(service.currentActiveRules[1]).toEqual('rule2');
    });
  });
});
