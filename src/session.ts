import { Client } from "./client";
import { v4 as uuid } from "uuid";
import WebSocket from "ws";
import { ClientMessage, Message, ServerHandshake } from "./message";
import log from "loglevel";

export interface SessionOptions
{
    playerUrl: string;
}

export class Session
{
    id: string;
    clients = new Map<string, Client>();
    options: SessionOptions;

    onExpire?: (session: Session) => void;

    constructor(options: SessionOptions)
    {
        this.options = options;
        this.id = uuid();
    }

    join(client: Client)
    {
        client.onMessage = this.onMsg.bind(this);
        this.clients.set(client.id, client);
        client.send(<ServerHandshake>{
            "type": "handshake",
            clientId: client.id
        });
    }

    reconnect(id: string, socket: WebSocket)
    {
        const client = this.clients.get(id);
        if (!client)
        {
            socket.close();
            return;
        }
        
        client.bind(socket);
        client.send(<ServerHandshake>{
            "type": "handshake",
            clientId: client.id
        });
    }

    onMsg(msg: ClientMessage, id: string)
    {
        if (msg.recipient)
        {
            log.debug(`${msg.type} Client{${id}} -> Session{${this.id}} -> Client{${msg.recipient}}`);
            const client = this.clients.get(msg.recipient);
            client?.send(msg);
        }
        else
        {
            log.debug(`${msg.type} Client{${id}} -> Session{${this.id}} -> All`);
            for (const client of this.clients.values())
            {
                if (client.id === id)
                    continue;
                client?.send(msg);
            }
        }
    }
}