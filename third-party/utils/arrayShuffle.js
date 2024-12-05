"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayShuffle = void 0;
const arrayShuffle = (array, { randomInt }) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
exports.arrayShuffle = arrayShuffle;
//# sourceMappingURL=arrayShuffle.js.map