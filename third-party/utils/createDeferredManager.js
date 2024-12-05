"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferredManager = void 0;
const createDeferred_1 = require("./createDeferred");
const createDeferredManager = (options) => {
    const { initialId = 0, timeout: defaultTimeout = 0, onTimeout } = options !== null && options !== void 0 ? options : {};
    const promises = [];
    let ID = initialId;
    let timeoutHandle;
    const length = () => promises.length;
    const nextId = () => ID;
    const replanTimeout = () => {
        const now = Date.now();
        const nearestDeadline = promises.reduce((prev, { deadline }) => (prev && deadline ? Math.min : Math.max)(prev, deadline), 0);
        if (timeoutHandle)
            clearTimeout(timeoutHandle);
        timeoutHandle = nearestDeadline
            ?
                setTimeout(timeoutCallback, Math.max(nearestDeadline - now, 0))
            : undefined;
    };
    const timeoutCallback = () => {
        const now = Date.now();
        promises
            .filter(promise => promise.deadline && promise.deadline <= now)
            .forEach(promise => {
            onTimeout === null || onTimeout === void 0 ? void 0 : onTimeout(promise.id);
            promise.deadline = 0;
        });
        replanTimeout();
    };
    const create = (timeout = defaultTimeout) => {
        const promiseId = ID++;
        const deferred = (0, createDeferred_1.createDeferred)(promiseId);
        const deadline = timeout && Date.now() + timeout;
        promises.push(Object.assign(Object.assign({}, deferred), { deadline }));
        if (timeout)
            replanTimeout();
        return { promiseId, promise: deferred.promise };
    };
    const extract = (promiseId) => {
        const index = promises.findIndex(({ id }) => id === promiseId);
        const [promise] = index >= 0 ? promises.splice(index, 1) : [undefined];
        if (promise === null || promise === void 0 ? void 0 : promise.deadline)
            replanTimeout();
        return promise;
    };
    const resolve = (promiseId, value) => {
        const promise = extract(promiseId);
        promise === null || promise === void 0 ? void 0 : promise.resolve(value);
        return !!promise;
    };
    const reject = (promiseId, error) => {
        const promise = extract(promiseId);
        promise === null || promise === void 0 ? void 0 : promise.reject(error);
        return !!promise;
    };
    const rejectAll = (error) => {
        promises.forEach(promise => promise.reject(error));
        const deleted = promises.splice(0, promises.length);
        if (deleted.length)
            replanTimeout();
    };
    return { length, nextId, create, resolve, reject, rejectAll };
};
exports.createDeferredManager = createDeferredManager;
//# sourceMappingURL=createDeferredManager.js.map