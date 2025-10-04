import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
export declare class ScatterGatherService {
    private readonly httpService;
    constructor(httpService: HttpService);
    gatherData(): Observable<any>;
    private callService1;
    private callService2;
    private callService3;
    private handleError;
    private handleGatherError;
    private processResults;
    private processProductService;
    private processUserService;
    private processPaymentService;
    private generateSummary;
    private calculateDiscountedPrice;
    private determineUserRole;
    private validatePaymentStatus;
    private formatCurrency;
    private calculateRiskLevel;
}
