"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttler = void 0;
class Throttler {
    constructor(delay) {
        this.delay = delay;
        this.intervals = {};
        this.callbacks = {};
    }
    throttle(id, callback) {
        if (this.intervals[id]) {
            this.callbacks[id] = callback;
        }
        else {
            callback();
            this.intervals[id] = setInterval(() => this.tick(id), this.delay);
        }
    }
    tick(id) {
        if (this.callbacks[id]) {
            this.callbacks[id]();
            delete this.callbacks[id];
        }
        else {
            this.cancel(id);
        }
    }
    cancel(id) {
        clearInterval(this.intervals[id]);
        delete this.intervals[id];
        delete this.callbacks[id];
    }
    dispose() {
        Object.keys(this.intervals).forEach(this.cancel, this);
    }
}
exports.Throttler = Throttler;
//# sourceMappingURL=throttler.js.map