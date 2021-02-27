import { Client } from "./client";
import { v4 as uuid } from "uuid";
import WebSocket from "ws";
import { Message } from "./message";
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
    }

    reconnect(id: string, socket: WebSocket)
    {
        this.clients.get(id)?.bind(socket);
    }

    onMsg(msg: Message, id: string)
    {
        log.debug(`${id} -> ${this.id}`);
        for (const client of this.clients.values())
        {
            if (client.id === id)
                continue;
            
            client.send(msg);
        }
    }
}