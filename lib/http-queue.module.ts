import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { HttpQueueService } from './services';
import { QueueConfig } from './interfaces';

@Module({
  imports: [HttpModule],
  providers: [HttpQueueService],
  exports: [HttpQueueService],
})
export class HttpQueueModule {
  static forRoot(params?: Partial<QueueConfig>): DynamicModule {
    const providers = HttpQueueModule._createQueueServiceProvider(params);
    return {
      module: HttpQueueModule,
      providers: providers,
      exports: providers,
    };
  }
  static forFeature(params?: Partial<QueueConfig>): DynamicModule {
    const providers = HttpQueueModule._createQueueServiceProvider(params);
    return {
      module: HttpQueueModule,
      providers: providers,
      exports: providers,
    };
  }

  private static _createQueueServiceProvider(params: Partial<QueueConfig>) {
    return [
      {
        provide: 'QUEUE_CONFIG',
        useFactory: () => params,
      },
      HttpQueueService,
    ];
  }
}
