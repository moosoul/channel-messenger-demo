import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hello() {
    return 'Hello Nest.js, current env is ' + process.env.NODE_ENV;
  }
}
