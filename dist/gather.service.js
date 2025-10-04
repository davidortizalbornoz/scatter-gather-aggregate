"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatherService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let GatherService = class GatherService {
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
GatherService = __decorate([
    (0, common_1.Injectable)()
], GatherService);
exports.GatherService = GatherService;
//# sourceMappingURL=gather.service.js.map