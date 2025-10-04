import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AggregatedResponse } from './model/aggregated-response.interface';
import { GatherService } from './gather.service';
export declare class ScatterService {
    private readonly httpService;
    private readonly gatherService;
    private readonly configService;
    private readonly logger;
    private readonly serviceConfigs;
    constructor(httpService: HttpService, gatherService: GatherService, configService: ConfigService);
    private initializeConfigs;
    gatherData(): Observable<AggregatedResponse>;
    private callService1;
    private callService2;
    private callService3;
    private handleError;
    private handleGatherError;
}
