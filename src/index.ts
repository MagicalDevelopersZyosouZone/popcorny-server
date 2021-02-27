import { default as Application, default as Koa } from "koa";
import websocket from "koa-easy-ws";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
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
        ...require("../config") as ServerOptions
    };
}
catch (err)
{
    log.warn("Failed to load config file, fallback to default configure");
}

const app = new Koa<Application.DefaultState, ServerContext>();

app.context.options = options;
app.use(websocket());
app.use(async (ctx, next) =>
{
    await next();
    log.info(`${ctx.method} ${ctx.url}`);
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