import log from "loglevel";
import { Queue } from "./queue";
import { Session, SessionOptions } from "./session";


class SessionManagerType
{
    private sessions = new Map<string, Session>();
    get(sessionId: string)
    {
        return this.sessions.get(sessionId);
    }
    new(options: SessionOptions, lifetime: number)
    {
        const session = new Session(options, lifetime);
        this.sessions.set(session.id, session);
        log.info(`New Session{${session.id}}`);

        return session;
    }
    remove(sessionId: string)
    {
        this.sessions.delete(sessionId);
    }
}

export const SessionManager = new SessionManagerType();