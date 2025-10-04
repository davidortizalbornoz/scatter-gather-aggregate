import { ScatterService } from '../services/scatter.service';
import { Observable } from 'rxjs';
export declare class AppController {
    private readonly scatterService;
    constructor(scatterService: ScatterService);
    getAggregatedData(): Observable<any>;
}
