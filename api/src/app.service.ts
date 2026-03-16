import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { response: string } {
    return { response: 'Hello World!' };
  }
}
