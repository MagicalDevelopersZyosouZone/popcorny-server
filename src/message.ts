export interface MessageBase<Type extends string>
{
    type: Type,
}

export interface ServerHandshake extends MessageBase<"handshake">
{
    clientId: string;
}

export interface SyncRequest extends MessageBase<"sync-request">
{
    clientId: string;
    tag: number;
    timestamp: number;
    currentTime: number;
    playbackRate: number;
}

export interface SyncResponse extends MessageBase<"sync-response">
{
    clientId: string;
    tag: number;
    timestamp: number;
    currentTime: number;
    playbackRate: number;
    response: {
        clientId: string,
        tag: number,
        timestamp: number,
    }
}

export interface SyncResponse
{
    tag: number;
    timestamp: number;
}

export type Message = SyncRequest | SyncResponse | ServerHandshake;