import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ScatterService } from '../services/scatter.service';
import { Observable } from 'rxjs';
import { GatherErrorInterceptor } from '../interceptors/gather-error.interceptor';

@Controller()
export class AppController {
  constructor(
    private readonly scatterService: ScatterService
  ) {}

  @Get('invoke-parallel-services')
  @UseInterceptors(GatherErrorInterceptor)
  getAggregatedData(): Observable<any> {
    return this.scatterService.gatherData();
  }
}