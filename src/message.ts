export interface MessageBase<Type extends string>
{
    type: Type,
}

export interface Sync extends MessageBase<"sync">
{
    clientId: string;
    tag: number;
    timestamp: number;
    position: number;
    playbackRate: number;
    response?: SyncResponse;
}

export interface SyncResponse
{
    tag: number;
    timestamp: number;
}

export type Message = Sync;