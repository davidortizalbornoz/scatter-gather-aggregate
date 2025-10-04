"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatherErrorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const gather_exception_1 = require("../exceptions/gather.exception");
let GatherErrorInterceptor = class GatherErrorInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)(error => {
            if (error.statusCode && error.details) {
                throw new gather_exception_1.GatherException(error);
            }
            const fullError = {
                statusCode: 500,
                message: 'Unexpected Error - Internal Error Processing',
                error: 'Unprocessable Entity',
                timestamp: new Date().toISOString(),
                path: context.switchToHttp().getRequest().url,
                details: {
                    phase: 'gather',
                    errorMessage: error.message || 'Unknown error',
                    errorType: error.name || error.constructor.name,
                }
            };
            throw new gather_exception_1.GatherException(fullError);
        }));
    }
};
GatherErrorInterceptor = __decorate([
    (0, common_1.Injectable)()
], GatherErrorInterceptor);
exports.GatherErrorInterceptor = GatherErrorInterceptor;
//# sourceMappingURL=gather-error.interceptor.js.map