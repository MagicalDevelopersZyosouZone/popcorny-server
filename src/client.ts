import WebSocket, { MessageEvent } from "ws";
import { v4 as uuid } from "uuid";
import { Message } from "./message";
import log from "loglevel";

export class Client
{
    id: string;
    socket: WebSocket | null = null;
    onMessage?: (msg: Message, id: string) => void;

    constructor()
    {
        this.id = uuid();
    }

    bind(socket: WebSocket)
    {
        this.close();
        this.socket = socket;
        socket.on("message", this.recv.bind(this));
        socket.on('error', this.close.bind(this));
        socket.on("close", this.close.bind(this));
    }

    close()
    {
        if (!this.socket)
            return;
        
        try
        {
            this.socket?.close();
        }
        catch
        {
            this.socket = null;
        }
    }

    send(message: Message)
    {
        if (!this.socket)
            return;
        
        try
        {
            this.socket.send(JSON.stringify(message));
        }
        catch (err)
        {
            this.close();
        }
    }

    recv(data: WebSocket.Data)
    {
        log.debug(`recv from ${this.id}`);
        let msg: Message;
        try
        {
            msg = JSON.parse(data as string) as Message;

            this.onMessage?.(msg, this.id);
        }
        catch (err)
        {
            log.warn(err);
            this.close();
        }
    }
}