import WebSocket, { MessageEvent } from "ws";
import http from "http";
import { Socket } from "net";
import { URL } from "url";
import { Session } from "./session";
import { promisify } from "util";
import { Client } from "./client";

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });
const sessions = new Map<string, Session>();

server.listen(5000, "0.0.0.0");

const reg = /^\/session\/([^\/]+)(?:\/([^\/]+))$/
server.on("upgrade", async (request: http.IncomingMessage, socket: Socket, head: Buffer) =>
{
    const path = new URL(request.url as string).pathname;

    const caps = reg.exec(path);
    if (caps && caps[1])
    {
        const clientId: string | undefined = caps[2];
        const sessionId = caps[1];
        const session = sessions.get(sessionId);
        if (!session)
        {
            socket.end('HTTP/1.1 404 Not Found\r\n\r\n');
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) =>
            handelNewConnection(ws, session, clientId));
    }
});

function handelNewConnection(ws: WebSocket, session: Session, clientId: string)
{
    if (clientId)
    {
        session.reconnect(clientId, ws);
    }
    else
    {
        const client = new Client();
        client.bind(ws);
        session.join(client);
    }

        
}