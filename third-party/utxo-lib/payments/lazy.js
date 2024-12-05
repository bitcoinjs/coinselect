"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prop = prop;
exports.value = value;
function prop(object, name, f) {
    Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get() {
            const value = f.call(this);
            this[name] = value;
            return value;
        },
        set(value) {
            Object.defineProperty(this, name, {
                configurable: true,
                enumerable: true,
                value,
                writable: true,
            });
        },
    });
}
function value(f) {
    let value;
    return () => {
        if (value !== undefined)
            return value;
        value = f();
        return value;
    };
}
//# sourceMappingURL=lazy.js.map