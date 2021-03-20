import { Client } from "./client";
import { PopcornyAPI } from "./api";
(window as any).Client = Client;
(window as any).Popcorny = PopcornyAPI;

async function createSessionAndClient()
{
    const session = await PopcornyAPI.session.create({}, { playerUrl: "" });
    const clientA = new Client(session.sessionId);
    const clientB = new Client(session.sessionId);
    clientA.onMessage = (msg) => console.log({ "A": msg });
    clientB.onMessage = (msg) => console.log({ "B": msg });
    return {
        session,
        clientA,
        clientB,
    };
}
(window as any).createSessionAndClient = createSessionAndClient;