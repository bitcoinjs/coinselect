"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEmitter = void 0;
const events_1 = require("events");
class TypedEmitter extends events_1.EventEmitter {
    listenerCount(eventName) {
        return super.listenerCount(eventName);
    }
}
exports.TypedEmitter = TypedEmitter;
//# sourceMappingURL=typedEventEmitter.js.map