import { Client } from "./client";
import uuid from "uuid";
import WebSocket from "ws";
import { Message } from "./message";

export class Session
{
    id: string;
    url: string;
    clients = new Map<string, Client>();
    constructor(url: string)
    {
        this.url = url;
        this.id = uuid.v4();
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
        for (const client of this.clients.values())
        {
            if (client.id === id)
                continue;
            
            client.send(msg);
        }
    }
}