import { Client } from "./client";
import { v4 as uuid } from "uuid";
import WebSocket from "ws";
import { Message, ServerHandshake } from "./message";
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

    onMsg(msg: Message, id: string)
    {
        log.debug(`${msg.type} Client{${id}} -> Session{${this.id}}`);
        switch (msg.type)
        {
            case "sync-request":
                for (const client of this.clients.values())
                {
                    if (client.id === id)
                        continue;

                    client.send(msg);
                }
                break;
            case "sync-response":
                const client = this.clients.get(msg.response.clientId);
                client?.send(msg);
                break;
        }
    }
}