"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeTx = composeTx;
const request_1 = require("./request");
const result_1 = require("./result");
const coinselect_1 = require("../coinselect");
function composeTx(request) {
    const coinselectRequest = (0, request_1.validateAndParseRequest)(request);
    if ('error' in coinselectRequest) {
        return coinselectRequest;
    }
    try {
        const result = (0, coinselect_1.coinselect)(coinselectRequest);
        return (0, result_1.getResult)(request, coinselectRequest, result);
    }
    catch (error) {
        return (0, result_1.getErrorResult)(error);
    }
}
//# sourceMappingURL=index.js.map