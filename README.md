<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Nest Http Queue

<p align="center">
    <a href="https://www.npmjs.com/@codemonkeys-island/nest-http-queue" target="_blank"><img src="https://img.shields.io/npm/v/@codemonkeys-island/nest-http-queue" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/@codemonkeys-island/nest-http-queue" target="_blank"><img src="https://img.shields.io/npm/l/@codemonkeys-island/nest-http-queue" alt="Package License"/></a>
    <a href="https://www.npmjs.com/@codemonkeys-island/nest-http-queue" target="_blank"><img src="https://img.shields.io/npm/dm/@codemonkeys-island/nest-http-queue" alt="NPM Downloads"/></a>
</p>

## Description

This is a [Nest](https://github.com/nestjs/nest) module for limit http calls per timespan.

Sometimes a server you want to access has a rate limit. In this case you have to limit your requests against this server.

This Module provides an easy-to-use service with the same API like the HttpService of [Nest.JS](https://github.com/nestjs)


## Installation

```bash
$ npm i --save @codemonkeys-island/nest-http-queue
```


## Usage

```typescript
import { Module } from '@nestjs/common';
import { HttpQueueModule } from '@codemonkeys-island/nest-http-queue';

@Module({
  imports: [
    HttpQueueModule.forRoot(),
  ]
})
export class AppModule {
}
```

```typescript
import { Injectable } from '@nestjs/common'; import { HttpQueueService } from "./http-queue.service";
import { HttpQueueService } from '@codemonkeys-island/nest-http-queue'; import { Observable } from "rxjs"; import { AxiosResponse } from "axios";

@Injectable()
export class RequestService {    
  constructor(private httpQueueService: HttpQueueService) {
  }
  
  /**
  * Queued Request
  **/
  requestExternalData(): Observable<AxiosResponse<any>> {
    return this.httpQueueService.get<any>('https://api.url.com');
  }

}
```

### Supported Http Requests:
- GET
- POST
- PUT
- PATCH
- HEAD
- REQUEST
- DELETE

### Initialize Module with configuration
Default configruation for rate limit queue is 10 requests per 10000ms.
```json5
{
  maxRequests: 10,
  timespan: 10000,
}
``` 

To inject a custom configuration just initialize the module with a configuration.

```typescript
import { Module } from '@nestjs/common';
import { HttpQueueModule } from '@codemonkeys-island/nest-http-queue';

@Module({
  imports: [
    HttpQueueModule.forRoot({
      default: {
        maxRequests: 5,
        timespan: 1000
      } 
    }),
  ]
})
export class AppModule {
}
```

## Stay in touch

- Author - [mrbacony](https://github.com/mrbacony)

## License

- Nest Http Schedule is [MIT licensed](LICENSE).