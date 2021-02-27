import http from "http";
import { Socket } from "net";
import { URL } from "url";
import { Session } from "./session";
import { promisify } from "util";
import { Client } from "./client";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
import Koa from "koa";
import websocket from "koa-easy-ws";
import Router from "koa-router";
import Application from "koa";
import fs from "fs";
import { router as controllerRouter } from "./controller";

log.enableAll();
const logger = log.noConflict();
prefix.reg(logger);
prefix.apply(logger);

let options: ServerOptions = {
    hostname: "localhost",
    port: 5000,
    shareLinkBase: "http://localhost:5000/",
}

try
{
    options = {
        ...options,
        ...require("./config.js").default as ServerOptions
    };
}
catch {
    log.warn("Failed to load config file, fallback to default configure");
}

const app = new Koa<Application.DefaultState, ServerContext>();

app.context.options = options;
app.use(websocket());
app.use(async (ctx, next) =>
{
    await next();
    log.info(`${ctx.url}`);
});
app.use(controllerRouter.routes());

app.listen(options.port, options.hostname);
log.info(`Server listen on ${options.hostname}:${options.port}`);

export interface ServerOptions
{
    hostname: string;
    port: number;
    shareLinkBase: string;
}
export interface ServerContext
{
    options: ServerOptions;
}