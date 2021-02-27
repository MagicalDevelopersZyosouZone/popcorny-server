import { Session, SessionOptions } from "./session";

class SessionManager
{
    sessions = new Map<string, Session>();
    get(sessionId: string)
    {
        return this.sessions.get(sessionId);
    }
    new(options: SessionOptions)
    {
        const session = new Session(options);
        session.onExpire = this.expire.bind(this);
        this.sessions.set(session.id, session);
        return session;
    }
    private expire(session: Session)
    {
        this.sessions.delete(session.id);
    }
}

export const sessionManager = new SessionManager();