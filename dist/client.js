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
        if (!this.socket)
            return;
        try {
            this.socket?.close();
        }
        catch {
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
        loglevel_1.default.debug(`recv from ${this.id}`);
        try {
            const msg = JSON.parse(data);
            this.onMessage?.(msg, this.id);
        }
        catch (err) {
            loglevel_1.default.warn(err);
            this.close();
        }
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map