import { Client } from "./client";
import { v4 as uuid } from "uuid";
import WebSocket from "ws";
import { ClientMessage, Message, ServerHandshake } from "./message";
import { SessionManager } from "./session-manager";
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
    destroied: boolean;
    lifetime: number;

    private timeout: NodeJS.Timeout;

    constructor(options: SessionOptions, lifetime: number)
    {
        this.options = options;
        this.id = uuid();
        this.destroied = false;
        this.lifetime = lifetime;
        this.timeout = setTimeout(this.destroy.bind(this), lifetime * 1000);
    }

    join(client: Client)
    {
        this.checkExpire();
        this.resetLifetime();
        
        client.onMessage = this.onMsg.bind(this);
        this.clients.set(client.id, client);
        client.send(<ServerHandshake>{
            "type": "handshake",
            clientId: client.id
        });
    }

    reconnect(id: string, socket: WebSocket)
    {
        this.checkExpire();
        this.resetLifetime();

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
        this.checkExpire();
        this.resetLifetime();
        
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
    
    private resetLifetime()
    {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.destroy.bind(this), this.lifetime * 1000);
    }

    private checkExpire()
    {
        if (this.destroied)
            throw new Error("Session expired");
    }

    destroy()
    {
        if (this.destroied)
            throw new Error("Duplicated destroy");
        log.info(`Session{${this.id}} out of lifetime.`);
        SessionManager.remove(this.id);
        for (const client of this.clients.values())
        {
            client.close("Session expired");
        }
        this.destroied = true;
    }
}