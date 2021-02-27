export interface MessageBase<Type extends string>
{
    type: Type,
}

export interface ServerHandshake extends MessageBase<"handshake">
{
    clientId: string;
}

export interface ForwardMessage extends MessageBase<string>
{
    clientId: string;
    recipient: string;
}

export interface BroadcastMessage extends MessageBase<string>
{
    clientId: string;
    recipient: null;
}

export type ServerMessage = ServerHandshake;
export type ClientMessage = ForwardMessage | BroadcastMessage;
export type Message = ServerMessage | ClientMessage;