"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    constructor(prefix, enabled, logWriter) {
        this.css = '';
        this.MAX_ENTRIES = 100;
        this.prefix = prefix;
        this.enabled = enabled;
        this.messages = [];
        if (logWriter) {
            this.logWriter = logWriter;
        }
    }
    setColors(colors) {
        this.css = typeof window !== 'undefined' && colors[this.prefix] ? colors[this.prefix] : '';
    }
    addMessage({ level, prefix, timestamp }, ...args) {
        const message = {
            level,
            prefix,
            css: this.css,
            message: args,
            timestamp: timestamp || Date.now(),
        };
        this.messages.push(message);
        if (this.logWriter) {
            try {
                this.logWriter.add(message);
            }
            catch (err) {
                console.error('There was an error adding log message', err, message);
            }
        }
        if (this.messages.length > this.MAX_ENTRIES) {
            this.messages.shift();
        }
    }
    setWriter(logWriter) {
        this.logWriter = logWriter;
    }
    log(...args) {
        this.addMessage({ level: 'log', prefix: this.prefix }, ...args);
        if (this.enabled) {
            console.log(`%c${this.prefix}`, this.css, ...args);
        }
    }
    error(...args) {
        this.addMessage({ level: 'error', prefix: this.prefix }, ...args);
        if (this.enabled) {
            console.error(`%c${this.prefix}`, this.css, ...args);
        }
    }
    info(...args) {
        this.addMessage({ level: 'info', prefix: this.prefix }, ...args);
        if (this.enabled) {
            console.info(`%c${this.prefix}`, this.css, ...args);
        }
    }
    warn(...args) {
        this.addMessage({ level: 'warn', prefix: this.prefix }, ...args);
        if (this.enabled) {
            console.warn(`%c${this.prefix}`, this.css, ...args);
        }
    }
    debug(...args) {
        this.addMessage({ level: 'debug', prefix: this.prefix }, ...args);
        if (this.enabled) {
            if (this.css) {
                console.log(`%c${this.prefix}`, this.css, ...args);
            }
            else {
                console.log(this.prefix, ...args);
            }
        }
    }
    getLog() {
        return this.messages;
    }
}
exports.Log = Log;
//# sourceMappingURL=logs.js.map