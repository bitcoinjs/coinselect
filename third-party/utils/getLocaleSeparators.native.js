"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleSeparators = getLocaleSeparators;
function getLocaleSeparators(locale) {
    const formattedNumber = new Intl.NumberFormat(locale).format(1234567.89);
    let thousandsSeparator = ' ';
    let decimalSeparator = '.';
    for (let i = 0; i < formattedNumber.length; i++) {
        if (!/\d/.test(formattedNumber[i])) {
            thousandsSeparator = formattedNumber[i];
            break;
        }
    }
    decimalSeparator = formattedNumber[formattedNumber.length - 3];
    return { decimalSeparator, thousandsSeparator };
}
//# sourceMappingURL=getLocaleSeparators.native.js.map