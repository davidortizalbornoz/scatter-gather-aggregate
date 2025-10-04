import { HttpException } from '@nestjs/common';

export class GatherException extends HttpException {
  constructor(response: any) {
    super(response, response.statusCode);
    Object.assign(this, response);
  }
}
