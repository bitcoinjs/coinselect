"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFullPath = void 0;
const isFullPath = (path) => {
    const fullPathPattern = /^(\/|([a-zA-Z]:\\))/;
    return fullPathPattern.test(path);
};
exports.isFullPath = isFullPath;
//# sourceMappingURL=isFullPath.js.map