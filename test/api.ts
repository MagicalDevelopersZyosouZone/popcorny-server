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
        create: api("POST", "http://localhost:5000/session")
            .body({ playerUrl: "string" })
            .response<SessionInfo>()
    }
}