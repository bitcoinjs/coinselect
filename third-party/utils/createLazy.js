"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLazy = void 0;
const createDeferred_1 = require("./createDeferred");
const createLazy = (initLazy, disposeLazy) => {
    let value;
    let valuePromise;
    const get = () => value;
    const getPending = () => valuePromise === null || valuePromise === void 0 ? void 0 : valuePromise.promise;
    const dispose = () => {
        if (valuePromise) {
            valuePromise.reject(new Error('Disposed during initialization'));
            valuePromise = undefined;
        }
        if (value !== undefined) {
            disposeLazy === null || disposeLazy === void 0 ? void 0 : disposeLazy(value);
            value = undefined;
        }
    };
    const getOrInit = (...args) => {
        if (value !== undefined)
            return Promise.resolve(value);
        if (!valuePromise) {
            const deferred = (0, createDeferred_1.createDeferred)();
            valuePromise = deferred;
            initLazy(...args)
                .then(val => {
                value = val;
                valuePromise = undefined;
                deferred.resolve(val);
            })
                .catch(err => {
                valuePromise = undefined;
                deferred.reject(err);
            });
        }
        return valuePromise.promise;
    };
    return { get, getPending, getOrInit, dispose };
};
exports.createLazy = createLazy;
//# sourceMappingURL=createLazy.js.map