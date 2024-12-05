"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeVersion = exports.isNewerOrEqual = exports.isEqual = exports.isNewer = exports.isVersionArray = void 0;
const throwError_1 = require("./throwError");
const isVersionArray = (arr) => Array.isArray(arr) &&
    arr.length === 3 &&
    arr.every(number => typeof number === 'number' && number >= 0);
exports.isVersionArray = isVersionArray;
const tryParse = (version) => {
    var _a;
    return (_a = version
        .match(/^(\d+)\.(\d+)\.(\d+)([+-].*)?$/)) === null || _a === void 0 ? void 0 : _a.slice(1, 4).map(n => Number(n));
};
const validateArray = (version) => ((0, exports.isVersionArray)(version) ? version : null);
const ensureArray = (version) => {
    var _a;
    return (_a = (typeof version === 'string' ? tryParse(version) : validateArray(version))) !== null && _a !== void 0 ? _a : (0, throwError_1.throwError)(`version string is in wrong format: ${version}`);
};
const compare = ([majorX, minorX, patchX], [majorY, minorY, patchY]) => majorX - majorY || minorX - minorY || patchX - patchY;
const isNewer = (versionX, versionY) => compare(ensureArray(versionX), ensureArray(versionY)) > 0;
exports.isNewer = isNewer;
const isEqual = (versionX, versionY) => compare(ensureArray(versionX), ensureArray(versionY)) === 0;
exports.isEqual = isEqual;
const isNewerOrEqual = (versionX, versionY) => compare(ensureArray(versionX), ensureArray(versionY)) >= 0;
exports.isNewerOrEqual = isNewerOrEqual;
const normalizeVersion = (version) => version.replace(/\b0+(\d)/g, '$1');
exports.normalizeVersion = normalizeVersion;
//# sourceMappingURL=versionUtils.js.map