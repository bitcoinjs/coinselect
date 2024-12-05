"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleSeparators = void 0;
const getLocaleSeparators = (locale) => {
    var _a, _b;
    const numberFormat = new Intl.NumberFormat(locale);
    const parts = numberFormat.formatToParts(10000.1);
    const decimalSeparator = (_a = parts.find(({ type }) => type === 'decimal')) === null || _a === void 0 ? void 0 : _a.value;
    const thousandsSeparator = (_b = parts.find(({ type }) => type === 'group')) === null || _b === void 0 ? void 0 : _b.value;
    return { decimalSeparator, thousandsSeparator };
};
exports.getLocaleSeparators = getLocaleSeparators;
//# sourceMappingURL=getLocaleSeparators.js.map