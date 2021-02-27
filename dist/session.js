"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const uuid_1 = require("uuid");
const loglevel_1 = __importDefault(require("loglevel"));
class Session {
    constructor(options) {
        this.clients = new Map();
        this.options = options;
        this.id = uuid_1.v4();
    }
    join(client) {
        client.onMessage = this.onMsg.bind(this);
        this.clients.set(client.id, client);
    }
    reconnect(id, socket) {
        var _a;
        (_a = this.clients.get(id)) === null || _a === void 0 ? void 0 : _a.bind(socket);
    }
    onMsg(msg, id) {
        loglevel_1.default.debug(`${id} -> ${this.id}`);
        for (const client of this.clients.values()) {
            if (client.id === id)
                continue;
            client.send(msg);
        }
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map