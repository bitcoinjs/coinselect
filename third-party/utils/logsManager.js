"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsManager = void 0;
const logs_1 = require("./logs");
class LogsManager {
    constructor({ colors }) {
        this.logs = {};
        this.colors = {};
        this.colors = colors;
    }
    initLog(prefix, enabled, logWriter) {
        const instanceWriter = logWriter || this.writer;
        const instance = new logs_1.Log(prefix, !!enabled, instanceWriter);
        if (this.colors) {
            instance.setColors(this.colors);
        }
        this.logs[prefix] = instance;
        return instance;
    }
    setLogWriter(logWriterFactory) {
        Object.keys(this.logs).forEach(key => {
            this.writer = logWriterFactory();
            if (this.writer) {
                this.logs[key].setWriter(this.writer);
                const { messages } = this.logs[key];
                messages.forEach(message => {
                    var _a;
                    (_a = this.writer) === null || _a === void 0 ? void 0 : _a.add(message);
                });
            }
        });
    }
    enableLog(enabled) {
        Object.keys(this.logs).forEach(key => {
            this.logs[key].enabled = !!enabled;
        });
    }
    enableLogByPrefix(prefix, enabled) {
        if (this.logs[prefix]) {
            this.logs[prefix].enabled = enabled;
        }
    }
    getLog() {
        let logs = [];
        Object.keys(this.logs).forEach(key => {
            logs = logs.concat(this.logs[key].messages);
        });
        logs.sort((a, b) => a.timestamp - b.timestamp);
        return logs;
    }
}
exports.LogsManager = LogsManager;
//# sourceMappingURL=logsManager.js.map