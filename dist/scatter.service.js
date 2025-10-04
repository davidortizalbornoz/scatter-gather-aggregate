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
var ScatterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
const operators_1 = require("rxjs/operators");
const gather_service_1 = require("./gather.service");
let ScatterService = ScatterService_1 = class ScatterService {
    constructor(httpService, gatherService, configService) {
        this.httpService = httpService;
        this.gatherService = gatherService;
        this.configService = configService;
        this.logger = new common_1.Logger(ScatterService_1.name);
        this.serviceConfigs = {
            service1: {
                url: '',
                timeout: 0,
                retry: 0
            },
            service2: {
                url: '',
                timeout: 0,
                retry: 0
            },
            service3: {
                url: '',
                timeout: 0,
                retry: 0
            }
        };
        this.initializeConfigs();
    }
    initializeConfigs() {
        this.serviceConfigs.service1 = {
            url: this.configService.get('SERVICIO1_URL'),
            timeout: this.configService.get('SERVICIO1_TIMEOUT'),
            retry: this.configService.get('SERVICIO1_RETRY')
        };
        this.serviceConfigs.service2 = {
            url: this.configService.get('SERVICIO2_URL'),
            timeout: this.configService.get('SERVICIO2_TIMEOUT'),
            retry: this.configService.get('SERVICIO2_RETRY')
        };
        this.serviceConfigs.service3 = {
            url: this.configService.get('SERVICIO3_URL'),
            timeout: this.configService.get('SERVICIO3_TIMEOUT'),
            retry: this.configService.get('SERVICIO3_RETRY')
        };
    }
    gatherData() {
        const service1$ = this.callService1().pipe((0, operators_1.timeout)(this.serviceConfigs.service1.timeout), (0, operators_1.retry)(this.serviceConfigs.service1.retry), (0, operators_1.catchError)(error => this.handleError('service1', error)));
        const service2$ = this.callService2().pipe((0, operators_1.timeout)(this.serviceConfigs.service2.timeout), (0, operators_1.retry)(this.serviceConfigs.service2.retry), (0, operators_1.catchError)(error => this.handleError('service2', error)));
        const service3$ = this.callService3().pipe((0, operators_1.timeout)(this.serviceConfigs.service3.timeout), (0, operators_1.retry)(this.serviceConfigs.service3.retry), (0, operators_1.catchError)(error => this.handleError('service3', error)));
        return (0, rxjs_1.forkJoin)({
            service1: service1$,
            service2: service2$,
            service3: service3$
        }).pipe((0, operators_1.map)(results => this.gatherService.processResults(results)), (0, operators_1.catchError)(error => this.handleGatherError(error)));
    }
    callService1() {
        this.logger.log(`Invocando Servicio de Productos: ${this.serviceConfigs.service1.url}`);
        return this.httpService.get(this.serviceConfigs.service1.url).pipe((0, operators_1.map)(response => ({
            success: true,
            data: response.data.products
        })));
    }
    callService2() {
        this.logger.log(`Invocando Servicio de Usuarios: ${this.serviceConfigs.service2.url}`);
        return this.httpService.get(this.serviceConfigs.service2.url).pipe((0, operators_1.map)(response => ({
            success: true,
            data: response.data.users
        })));
    }
    callService3() {
        this.logger.log(`Invocando Servicio de Pagos: ${this.serviceConfigs.service3.url}`);
        return this.httpService.get(this.serviceConfigs.service3.url).pipe((0, operators_1.map)(response => ({
            success: true,
            data: response.data.payments
        })));
    }
    handleError(serviceName, error) {
        var _a;
        if (error instanceof rxjs_1.TimeoutError) {
            const errorMessage = `${serviceName} timeout`;
            this.logger.error(errorMessage);
            return (0, rxjs_1.of)({
                success: false,
                data: null,
                error: errorMessage
            });
        }
        if (error instanceof axios_2.AxiosError) {
            const statusCode = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
            let errorMessage;
            switch (statusCode) {
                case 404:
                    errorMessage = `${serviceName}: Recurso no encontrado (404)`;
                    break;
                case 400:
                    errorMessage = `${serviceName}: Solicitud inválida (400)`;
                    break;
                case 403:
                    errorMessage = `${serviceName}: Acceso denegado (403)`;
                    break;
                case 500:
                    errorMessage = `${serviceName}: Error interno del servidor (500)`;
                    break;
                default:
                    errorMessage = `${serviceName} error: ${error.message}`;
            }
            this.logger.error(errorMessage, error.stack);
            return (0, rxjs_1.of)({
                success: false,
                data: null,
                error: errorMessage
            });
        }
        const errorMessage = `${serviceName} error: ${error.message}`;
        this.logger.error(errorMessage, error.stack);
        return (0, rxjs_1.of)({
            success: false,
            data: null,
            error: errorMessage
        });
    }
    handleGatherError(error) {
        this.logger.error('Error during gather phase:', error);
        return (0, rxjs_1.throwError)(() => ({
            statusCode: 422,
            message: 'Error al procesar la agregación de datos',
            error: 'Unprocessable Entity',
            timestamp: new Date().toISOString(),
            path: '/aggregate',
            details: {
                phase: 'gather',
                errorMessage: error.message || 'Unknown error',
                errorType: error.name || error.constructor.name,
            }
        }));
    }
};
ScatterService = ScatterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        gather_service_1.GatherService,
        config_1.ConfigService])
], ScatterService);
exports.ScatterService = ScatterService;
//# sourceMappingURL=scatter.service.js.map