"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const uuid_1 = require("uuid");
const loglevel_1 = __importDefault(require("loglevel"));
class Client {
    constructor() {
        this.socket = null;
        this.id = uuid_1.v4();
    }
    bind(socket) {
        this.close();
        this.socket = socket;
        socket.on("message", this.recv.bind(this));
        socket.on('error', this.close.bind(this));
        socket.on("close", this.close.bind(this));
    }
    close() {
        var _a;
        if (!this.socket)
            return;
        try {
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close();
        }
        catch (_b) {
            this.socket = null;
        }
    }
    send(message) {
        if (!this.socket)
            return;
        try {
            this.socket.send(JSON.stringify(message));
        }
        catch (err) {
            this.close();
        }
    }
    recv(data) {
        var _a;
        loglevel_1.default.debug(`recv from ${this.id}`);
        let msg;
        try {
            msg = JSON.parse(data);
            (_a = this.onMessage) === null || _a === void 0 ? void 0 : _a.call(this, msg, this.id);
        }
        catch (err) {
            loglevel_1.default.warn(err);
            this.close();
        }
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map