"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ErrorInterceptor = class ErrorInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)(err => {
            if ((err === null || err === void 0 ? void 0 : err.statusCode) && (err === null || err === void 0 ? void 0 : err.details)) {
                return (0, rxjs_1.throwError)(() => err);
            }
            return (0, rxjs_1.throwError)(() => ({
                statusCode: err.status || 500,
                message: err.message || 'Internal server error',
                error: err.error || 'Internal Server Error',
                timestamp: new Date().toISOString(),
                path: context.switchToHttp().getRequest().url,
                details: err
            }));
        }));
    }
};
ErrorInterceptor = __decorate([
    (0, common_1.Injectable)()
], ErrorInterceptor);
exports.ErrorInterceptor = ErrorInterceptor;
//# sourceMappingURL=error.interceptor.js.map