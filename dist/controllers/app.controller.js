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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const scatter_service_1 = require("../services/scatter.service");
const rxjs_1 = require("rxjs");
const gather_error_interceptor_1 = require("../interceptors/gather-error.interceptor");
let AppController = class AppController {
    constructor(scatterService) {
        this.scatterService = scatterService;
    }
    getAggregatedData() {
        return this.scatterService.gatherData();
    }
};
__decorate([
    (0, common_1.Get)('invoke-parallel-services'),
    (0, common_1.UseInterceptors)(gather_error_interceptor_1.GatherErrorInterceptor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "getAggregatedData", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [scatter_service_1.ScatterService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map