"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyByValue = getKeyByValue;
exports.getValueByKey = getValueByKey;
function getKeyByValue(obj, value) {
    return obj && Object.keys(obj).find(x => obj[x] === value);
}
function getValueByKey(obj, enumKey) {
    const key = obj && Object.keys(obj).find(x => x === enumKey);
    return key && obj[key];
}
//# sourceMappingURL=enumUtils.js.map