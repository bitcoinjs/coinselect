"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeakRandomId = void 0;
const getWeakRandomId = (length) => {
    let id = '';
    const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        id += list.charAt(Math.floor(Math.random() * list.length));
    }
    return id;
};
exports.getWeakRandomId = getWeakRandomId;
//# sourceMappingURL=getWeakRandomId.js.map