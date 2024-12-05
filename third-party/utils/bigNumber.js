"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNumber = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
exports.BigNumber = bignumber_js_1.default.clone({
    EXPONENTIAL_AT: 1e9,
});
//# sourceMappingURL=bigNumber.js.map