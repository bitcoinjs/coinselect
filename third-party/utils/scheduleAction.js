"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAction = void 0;
const tslib_1 = require("tslib");
const isArray = (attempts) => Array.isArray(attempts);
const abortedBySignal = () => new Error('Aborted by signal');
const abortedByDeadline = () => new Error('Aborted by deadline');
const abortedByTimeout = () => new Error('Aborted by timeout');
const resolveAfterMs = (ms, clear) => new Promise((resolve, reject) => {
    if (clear.aborted)
        return reject();
    if (ms === undefined)
        return resolve();
    let timeout;
    const onClear = () => {
        clearTimeout(timeout);
        clear.removeEventListener('abort', onClear);
        reject();
    };
    timeout = setTimeout(() => {
        clear.removeEventListener('abort', onClear);
        resolve();
    }, ms);
    clear.addEventListener('abort', onClear);
});
const rejectAfterMs = (ms, reason, clear) => new Promise((_, reject) => {
    if (clear.aborted)
        return reject();
    let timeout;
    const onClear = () => {
        clearTimeout(timeout);
        clear.removeEventListener('abort', onClear);
        reject();
    };
    timeout = setTimeout(() => {
        clear.removeEventListener('abort', onClear);
        reject(reason());
    }, ms);
    clear.addEventListener('abort', onClear);
});
const maybeRejectAfterMs = (ms, reason, clear) => ms === undefined ? [] : [rejectAfterMs(ms, reason, clear)];
const rejectWhenAborted = (signal, clear) => new Promise((_, reject) => {
    if (clear.aborted)
        return reject();
    if (signal === null || signal === void 0 ? void 0 : signal.aborted)
        return reject(abortedBySignal());
    const onAbort = () => reject(abortedBySignal());
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', onAbort);
    const onClear = () => {
        signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', onAbort);
        clear.removeEventListener('abort', onClear);
        reject();
    };
    clear.addEventListener('abort', onClear);
});
const resolveAction = (action, clear) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const aborter = new AbortController();
    if (clear.aborted)
        aborter.abort();
    const onClear = () => {
        clear.removeEventListener('abort', onClear);
        aborter.abort();
    };
    clear.addEventListener('abort', onClear);
    try {
        return yield new Promise(resolve => resolve(action(aborter.signal)));
    }
    finally {
        if (!clear.aborted)
            clear.removeEventListener('abort', onClear);
    }
});
const attemptLoop = (attempts, attempt, failure, clear) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    for (let a = 0; a < attempts - 1; a++) {
        if (clear.aborted)
            break;
        const aborter = new AbortController();
        const onClear = () => aborter.abort();
        clear.addEventListener('abort', onClear);
        try {
            return yield attempt(a, aborter.signal);
        }
        catch (error) {
            onClear();
            yield failure(a, error);
        }
        finally {
            clear.removeEventListener('abort', onClear);
        }
    }
    return clear.aborted ? Promise.reject() : attempt(attempts - 1, clear);
});
const scheduleAction = (action, params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { signal, delay, attempts, timeout, deadline, gap, attemptFailureHandler } = params;
    const deadlineMs = deadline && deadline - Date.now();
    const attemptCount = isArray(attempts)
        ? attempts.length
        : attempts !== null && attempts !== void 0 ? attempts : (deadline ? Infinity : 1);
    const clearAborter = new AbortController();
    const clear = clearAborter.signal;
    const getParams = isArray(attempts)
        ? (attempt) => attempts[attempt]
        : () => ({ timeout, gap });
    try {
        return yield Promise.race([
            rejectWhenAborted(signal, clear),
            ...maybeRejectAfterMs(deadlineMs, abortedByDeadline, clear),
            resolveAfterMs(delay, clear).then(() => attemptLoop(attemptCount, (attempt, abort) => Promise.race([
                ...maybeRejectAfterMs(getParams(attempt).timeout, abortedByTimeout, clear),
                resolveAction(action, abort),
            ]), (attempt, error) => {
                var _a;
                const errorHandlerResult = attemptFailureHandler === null || attemptFailureHandler === void 0 ? void 0 : attemptFailureHandler(error);
                return errorHandlerResult
                    ? Promise.reject(errorHandlerResult)
                    : resolveAfterMs((_a = getParams(attempt).gap) !== null && _a !== void 0 ? _a : 0, clear);
            }, clear)),
        ]);
    }
    finally {
        clearAborter.abort();
    }
});
exports.scheduleAction = scheduleAction;
//# sourceMappingURL=scheduleAction.js.map