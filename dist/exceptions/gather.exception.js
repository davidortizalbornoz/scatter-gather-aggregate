"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatherException = void 0;
const common_1 = require("@nestjs/common");
class GatherException extends common_1.HttpException {
    constructor(response) {
        super(response, response.statusCode);
        Object.assign(this, response);
    }
}
exports.GatherException = GatherException;
//# sourceMappingURL=gather.exception.js.map