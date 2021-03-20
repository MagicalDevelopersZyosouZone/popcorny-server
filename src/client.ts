import WebSocket, { MessageEvent } from "ws";
import { v4 as uuid } from "uuid";
import { ClientMessage, Message } from "./message";
import log from "loglevel";

export class Client
{
    id: string;
    onMessage?: (msg: ClientMessage, id: string) => void;

    private socket: WebSocket | null = null;

    constructor()
    {
        this.id = uuid();
    }

    bind(socket: WebSocket)
    {
        this.close(1000, "Socket reconnect");
        this.socket = socket;
        socket.on("message", this.onMsg);
        socket.on('error', this.onErr);
        socket.on("close", this.onClose);
    }

    close(code = 1013, reason: string = "No reason")
    {
        log.info(`Client{${this.id}} close: ${reason}`);
        if (!this.socket)
            return;
        
        try
        {
            this.socket?.close(code, reason);
        }
        catch { }
        this.unbind();
    }

    send(message: Message)
    {
        if (!this.socket)
        {
            log.debug(`Send failed: Client{${this.id}} offline`);
            return;
        }
        
        try
        {
            this.socket.send(JSON.stringify(message));
        }
        catch (err)
        {
            this.close(1013, "Send failed");
        }
    }

    private unbind()
    {
        this.socket?.off("message", this.onMsg);
        this.socket?.off('error', this.onErr);
        this.socket?.off("close", this.onClose);
    }

    private onClose = (code: number, reason: string) =>
    {
        log.info(`Client{${this.id}} closed: ${code}: ${reason}`);
        this.unbind();
    }

    private onErr = (err: Error) =>
    {
        log.warn(`Client{${this.id}} errored: ${err}`);
        this.close(1013, "Error occured.");
    }

    private onMsg = (data: WebSocket.Data) =>
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
            this.close(1013, "Internal error");
        }
    }
}