"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCooldown = void 0;
const createCooldown = (cooldownMs) => {
    let last = 0;
    return () => {
        const now = Date.now();
        if (now - last >= cooldownMs) {
            last = now;
            return true;
        }
        return false;
    };
};
exports.createCooldown = createCooldown;
//# sourceMappingURL=createCooldown.js.map