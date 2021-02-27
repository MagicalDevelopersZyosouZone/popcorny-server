"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionManager = void 0;
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
        return session;
    }
    expire(session) {
        this.sessions.delete(session.id);
    }
}
exports.sessionManager = new SessionManager();
//# sourceMappingURL=session-manager.js.map