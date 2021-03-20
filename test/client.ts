import { BroadcastMessage, ForwardMessage, Message, MessageBase, ServerHandshake } from "../src/message";

export interface PlayerState {
    currentTime: number;
    playbackRate: number;
}

export class Client
{
    ws: WebSocket;
    id: string;
    sessionId: string;
    onMessage?: (msg: Message) => void;
    
    private _ready = false;

    constructor(sessionId: string)
    {
        this.ws = new WebSocket(`ws://localhost:5000/session/${sessionId}`);
        this.id = "";
        this.sessionId = sessionId;

        this.ws.onmessage = (ev) =>
        {
            const handshake = JSON.parse(ev.data as string) as Message;
            if (handshake.type !== "handshake")
                throw new Error("Invalid message from server");
            this.ws.onmessage = this.recv.bind(this);
            this.id = handshake.clientId;
            this._ready = true;
        }
    }

    get ready() { return this._ready }

    sendto<T extends MessageBase<string>>(clientId: string, data: T)
    {
        const msg = <ForwardMessage>{
            ...data,
            recipient: clientId,
            clientId: this.id,
        };
        this.send(msg);
    }

    broadcast<T extends MessageBase<string>>(data: T)
    {
        const msg = <BroadcastMessage>{
            ...data,
            clientId: this.id,
            recipient: null,
        };
    }

    reconnect()
    {
        this._ready = false;
        console.info("Reconnecting...");

        this.ws = new WebSocket(`ws://localhost:5000/session/${this.sessionId}/${this.id}`);
        this.ws.onmessage = (ev) =>
        {
            const handshake = JSON.parse(ev.data as string) as Message;
            if (handshake.type !== "handshake")
                throw new Error("Invalid message from server");
            if (handshake.clientId !== this.id)
                throw new Error("Invalid handshake from server.");
            
            this.ws.onmessage = this.recv.bind(this);
            this._ready = true;
        }
    }

    private recv(ev: MessageEvent)
    {
        const msg = JSON.parse(ev.data) as Message;
        this.onMessage?.(msg);
    }
    private send(msg: Message)
    {
        try
        {
            this.ws.send(JSON.stringify(msg));
        }
        catch (err)
        {
            console.error(`Send failed ${err}`);
            this.reconnect();
        }
    }
}