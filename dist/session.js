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
        client.send({
            "type": "handshake",
            clientId: client.id
        });
    }
    reconnect(id, socket) {
        const client = this.clients.get(id);
        if (!client) {
            socket.close();
            return;
        }
        client.bind(socket);
        client.send({
            "type": "handshake",
            clientId: client.id
        });
    }
    onMsg(msg, id) {
        if (msg.recipient) {
            loglevel_1.default.debug(`${msg.type} Client{${id}} -> Session{${this.id}} -> Client{${msg.recipient}}`);
            const client = this.clients.get(msg.recipient);
            client?.send(msg);
        }
        else {
            loglevel_1.default.debug(`${msg.type} Client{${id}} -> Session{${this.id}} -> All`);
            for (const client of this.clients.values()) {
                if (client.id === id)
                    continue;
                client?.send(msg);
            }
        }
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map