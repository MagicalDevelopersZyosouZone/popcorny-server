"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionManager = void 0;
const loglevel_1 = __importDefault(require("loglevel"));
const session_1 = require("./session");
class SessionManager {
    constructor() {
        this.sessions = new Map();
    }
    get(sessionId) {
        return this.sessions.get(sessionId);
    }
    new(options) {
        const session = new session_1.Session(options);
        session.onExpire = this.expire.bind(this);
        this.sessions.set(session.id, session);
        loglevel_1.default.info(`New Session{${session.id}}`);
        return session;
    }
    expire(session) {
        this.sessions.delete(session.id);
    }
}
exports.sessionManager = new SessionManager();
//# sourceMappingURL=session-manager.js.map