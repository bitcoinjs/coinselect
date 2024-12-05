"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitStringEveryNCharacters = splitStringEveryNCharacters;
function splitStringEveryNCharacters(value, n) {
    var _a;
    if (n === 0) {
        return [];
    }
    const regex = new RegExp(`.{1,${n}}`, 'g');
    return (_a = value.match(regex)) !== null && _a !== void 0 ? _a : [];
}
//# sourceMappingURL=splitStringEveryNCharacters.js.map