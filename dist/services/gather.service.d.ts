import { AggregatedResponse } from '../model/aggregated-response.interface';
export declare class GatherService {
    processResults(results: any): AggregatedResponse;
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
