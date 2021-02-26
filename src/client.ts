import WebSocket, { MessageEvent } from "ws";
import uuid from "uuid";
import { Message } from "./message";

export class Client
{
    id: string;
    socket: WebSocket | null = null;
    onMessage?: (msg: Message, id: string) => void;

    constructor()
    {
        this.id = uuid.v4();
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

    recv(ev: MessageEvent)
    {
        let msg: Message;
        try
        {
            msg = JSON.parse(ev.data as string) as Message;

            this.onMessage?.(msg, this.id);
        }
        catch (err)
        {
            this.close();
        }
    }
}