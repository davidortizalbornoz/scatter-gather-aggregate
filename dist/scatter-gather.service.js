"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterGatherService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
let ScatterGatherService = class ScatterGatherService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    gatherData() {
        const service1$ = this.callService1().pipe((0, operators_1.timeout)(5000), (0, operators_1.retry)(2), (0, operators_1.catchError)(error => this.handleError('service1', error)));
        const service2$ = this.callService2().pipe((0, operators_1.timeout)(5000), (0, operators_1.retry)(2), (0, operators_1.catchError)(error => this.handleError('service2', error)));
        const service3$ = this.callService3().pipe((0, operators_1.timeout)(5000), (0, operators_1.retry)(2), (0, operators_1.catchError)(error => this.handleError('service3', error)));
        return (0, rxjs_1.forkJoin)({
            service1: service1$,
            service2: service2$,
            service3: service3$
        }).pipe((0, operators_1.map)(results => this.processResults(results)), (0, operators_1.catchError)(error => this.handleGatherError(error)));
    }
    callService1() {
        return this.httpService.get('api1/endpoint').pipe((0, operators_1.map)(response => ({
            success: true,
            data: response.data
        })));
    }
    callService2() {
        return this.httpService.get('api2/endpoint').pipe((0, operators_1.map)(response => ({
            success: true,
            data: response.data
        })));
    }
    callService3() {
        return this.httpService.get('api3/endpoint').pipe((0, operators_1.map)(response => ({
            success: true,
            data: response.data
        })));
    }
    handleError(serviceName, error) {
        if (error instanceof rxjs_1.TimeoutError) {
            return (0, rxjs_1.of)({
                success: false,
                data: null,
                error: `${serviceName} timeout`
            });
        }
        return (0, rxjs_1.of)({
            success: false,
            data: null,
            error: `${serviceName} error: ${error.message}`
        });
    }
    handleGatherError(error) {
        return (0, rxjs_1.throwError)(() => ({
            success: false,
            error: 'Gather operation failed',
            details: error
        }));
    }
    processResults(results) {
        const startTime = Date.now();
        const processedData = {
            service1: this.processProductService(results.service1),
            service2: this.processUserService(results.service2),
            service3: this.processPaymentService(results.service3)
        };
        const failedServices = Object.entries(results)
            .filter(([_, value]) => !value.success)
            .map(([key]) => key);
        const response = {
            success: failedServices.length === 0,
            failedServices,
            timestamp: new Date(),
            metrics: {
                total: Object.keys(results).length,
                successful: Object.keys(results).length - failedServices.length,
                failed: failedServices.length,
                processingTimeMs: Date.now() - startTime
            },
            data: {
                products: processedData.service1,
                users: processedData.service2,
                payments: processedData.service3
            },
            summary: this.generateSummary(processedData)
        };
        return response;
    }
    processProductService(result) {
        if (!result.success) {
            return {
                id: (0, uuid_1.v4)(),
                type: 'PRODUCT',
                timestamp: new Date(),
                status: 'FAILED',
                data: null
            };
        }
        const processedProducts = result.data.map(product => (Object.assign(Object.assign({}, product), { price: this.calculateDiscountedPrice(product), inStock: product.quantity > 0, category: product.category.toUpperCase() })));
        return {
            id: (0, uuid_1.v4)(),
            type: 'PRODUCT',
            timestamp: new Date(),
            status: 'SUCCESS',
            data: processedProducts
        };
    }
    processUserService(result) {
        if (!result.success) {
            return {
                id: (0, uuid_1.v4)(),
                type: 'USER',
                timestamp: new Date(),
                status: 'FAILED',
                data: null
            };
        }
        const processedUsers = result.data.map(user => (Object.assign(Object.assign({}, user), { fullName: `${user.firstName} ${user.lastName}`, isActive: user.lastLogin > Date.now() - (30 * 24 * 60 * 60 * 1000), role: this.determineUserRole(user) })));
        return {
            id: (0, uuid_1.v4)(),
            type: 'USER',
            timestamp: new Date(),
            status: 'SUCCESS',
            data: processedUsers
        };
    }
    processPaymentService(result) {
        if (!result.success) {
            return {
                id: (0, uuid_1.v4)(),
                type: 'PAYMENT',
                timestamp: new Date(),
                status: 'FAILED',
                data: null
            };
        }
        const processedPayments = result.data.map(payment => (Object.assign(Object.assign({}, payment), { status: this.validatePaymentStatus(payment), formattedAmount: this.formatCurrency(payment.amount), riskLevel: this.calculateRiskLevel(payment) })));
        return {
            id: (0, uuid_1.v4)(),
            type: 'PAYMENT',
            timestamp: new Date(),
            status: 'SUCCESS',
            data: processedPayments
        };
    }
    generateSummary(processedData) {
        var _a, _b, _c;
        const parts = [];
        if ((_a = processedData.service1) === null || _a === void 0 ? void 0 : _a.data) {
            parts.push(`Products: ${processedData.service1.data.length} items processed`);
        }
        if ((_b = processedData.service2) === null || _b === void 0 ? void 0 : _b.data) {
            parts.push(`Users: ${processedData.service2.data.length} profiles found`);
        }
        if ((_c = processedData.service3) === null || _c === void 0 ? void 0 : _c.data) {
            parts.push(`Payments: ${processedData.service3.data.length} transactions analyzed`);
        }
        return parts.join(' | ') || 'No data processed';
    }
    calculateDiscountedPrice(product) {
        return product.price * 0.9;
    }
    determineUserRole(user) {
        var _a;
        return ((_a = user.permissions) === null || _a === void 0 ? void 0 : _a.length) > 5 ? 'ADMIN' : 'USER';
    }
    validatePaymentStatus(payment) {
        return payment.amount > 0 && payment.confirmed ? 'COMPLETED' : 'PENDING';
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    }
    calculateRiskLevel(payment) {
        if (payment.amount > 1000000)
            return 'HIGH';
        if (payment.amount > 100000)
            return 'MEDIUM';
        return 'LOW';
    }
};
ScatterGatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ScatterGatherService);
exports.ScatterGatherService = ScatterGatherService;
//# sourceMappingURL=scatter-gather.service.js.map