import { api } from "./api-builder";

interface SessionOptions
{
    playerUrl: string,
}

interface SessionInfo
{
    sessionId: string,
}

export const PopcornyAPI = {
    session: {
        create: api("POST", "session")
            .body({ playerUrl: "string" })
            .response<SessionInfo>()
    }
}