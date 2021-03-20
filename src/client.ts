import WebSocket, { MessageEvent } from "ws";
import { v4 as uuid } from "uuid";
import { ClientMessage, Message, ServerClose } from "./message";
import log from "loglevel";

export class Client
{
    id: string;
    socket: WebSocket | null = null;
    onMessage?: (msg: ClientMessage, id: string) => void;

    constructor()
    {
        this.id = uuid();
    }

    bind(socket: WebSocket)
    {
        this.close("Socket reconnect");
        this.socket = socket;
        socket.on("message", this.recv.bind(this));
        socket.on('error', this.close.bind(this));
        socket.on("close", this.close.bind(this));
    }

    close(reason: string = "No reason")
    {
        if (!this.socket)
            return;
        
        try
        {
            this.socket?.send(JSON.stringify(<ServerClose>{
                type: "close",
                reason,
            }));
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
            this.close("Send failed");
        }
    }

    recv(data: WebSocket.Data)
    {
        log.debug(`recv from ${this.id}`);
        try
        {
            const msg = JSON.parse(data as string) as ClientMessage;

            this.onMessage?.(msg, this.id);
        }
        catch (err)
        {
            log.warn(err);
            this.close("Internal error");
        }
    }
}