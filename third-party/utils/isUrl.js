"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrl = void 0;
const URL_REGEXP = /^(http|ws)s?:\/\/[a-z0-9]([a-z0-9.-]+)?(:[0-9]{1,5})?((\/)?(([a-z0-9-_])+(\/)?)+)$/i;
const isUrl = (value) => URL_REGEXP.test(value);
exports.isUrl = isUrl;
//# sourceMappingURL=isUrl.js.map