"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferred = void 0;
const createDeferred = (id) => {
    let localResolve = () => { };
    let localReject = () => { };
    const promise = new Promise((resolve, reject) => {
        localResolve = resolve;
        localReject = reject;
    });
    return {
        id,
        resolve: localResolve,
        reject: localReject,
        promise,
    };
};
exports.createDeferred = createDeferred;
//# sourceMappingURL=createDeferred.js.map