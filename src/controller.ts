import { WebSocketContext } from "koa-easy-ws";
import Router from "koa-router";
import { ServerContext } from ".";
import { Client } from "./client";
import { SessionOptions } from "./session";
import { sessionManager } from "./session-manager";
import { URL } from "url";
import { jsonBody, JsonBodyContext } from "./middleware/body";
import log from "loglevel";

const router = new Router<any, WebSocketContext & ServerContext>();


router.all("/session/:sessionId", async (ctx) =>
{
    const sessionId = ctx.params.sessionId;
    const session = sessionManager.get(sessionId);
    if (!session)
    {
        ctx.response.status = 404;
        return;
    }

    if (ctx.ws)
    {
        const ws = await ctx.ws();
        const client = new Client();
        client.bind(ws);
        session.join(client);
        log.info(`New client ${client.id} join to ${sessionId}`);
    }
    else
    {
        ctx.response.status = 400;
        return;
    }
});

router.all("/session/:sessionId/:clientId", async (ctx) =>
{
    const sessionId = ctx.params.sessionId;
    const session = sessionManager.get(sessionId);
    if (!session)
    {
        ctx.response.status = 404;
        return;
    }

    if (ctx.ws)
    {
        const ws = await ctx.ws();
        session.reconnect(ctx.params.clientId, ws);
        log.info(`Client ${ctx.params.clientId} reconnect to ${sessionId}`);
    }
    else
    {
        ctx.response.status = 400;
        return;
    }
});


interface NewSessionResponse
{
    sharelink: string;
}

router.post<any, JsonBodyContext<SessionOptions>>("/session", jsonBody, async (ctx) =>
{
    const options = ctx.request.body;
    const session = sessionManager.new(options);
    ctx.set("Content-Type", "application/json");
    ctx.body = JSON.stringify(<NewSessionResponse>{
        sharelink: new URL(`join/${session.id}`, ctx.options.shareLinkBase).href
    });
});

export { router };