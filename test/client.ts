import { Message, ServerHandshake, SyncRequest, SyncResponse } from "../src/message";

export interface PlayerState {
    currentTime: number;
    playbackRate: number;
}

export class Client
{
    ws: WebSocket;
    id: string;
    onMessage?: (msg: Message) => void;
    
    private _ready = false;

    constructor(sessionId: string)
    {
        this.ws = new WebSocket(`ws://localhost:5000/session/${sessionId}`);
        this.id = "";

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

    requestSync(playerState: PlayerState, tag = 0)
    {
        const msg: SyncRequest = {
            type: "sync-request",
            clientId: this.id,
            tag,
            timestamp: Date.now(),
            ...playerState
        };
        this.send(msg);
    }

    responseSync(req: SyncRequest, playerState: PlayerState, tag = 0)
    {
        const msg: SyncResponse = {
            type: "sync-response",
            clientId: this.id,
            tag,
            timestamp: Date.now(),
            response: {
                clientId: req.clientId,
                tag: req.tag,
                timestamp: req.timestamp,
            },
            ...playerState
        };
        this.send(msg);
    }

    private recv(ev: MessageEvent)
    {
        const msg = JSON.parse(ev.data) as Message;
        this.onMessage?.(msg);
    }
    private send(msg: Message)
    {
        this.ws.send(JSON.stringify(msg));
    }
}