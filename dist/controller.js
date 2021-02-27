"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const client_1 = require("./client");
const session_manager_1 = require("./session-manager");
const url_1 = require("url");
const body_1 = require("./middleware/body");
const loglevel_1 = __importDefault(require("loglevel"));
const router = new koa_router_1.default();
exports.router = router;
router.all("/session/:sessionId", async (ctx) => {
    const sessionId = ctx.params.sessionId;
    const session = session_manager_1.sessionManager.get(sessionId);
    if (!session) {
        ctx.response.status = 404;
        return;
    }
    if (ctx.ws) {
        const ws = await ctx.ws();
        const client = new client_1.Client();
        client.bind(ws);
        session.join(client);
        loglevel_1.default.info(`New client ${client.id} join to ${sessionId}`);
    }
    else {
        ctx.response.status = 400;
        return;
    }
});
router.all("/session/:sessionId/:clientId", async (ctx) => {
    const sessionId = ctx.params.sessionId;
    const session = session_manager_1.sessionManager.get(sessionId);
    if (!session) {
        ctx.response.status = 404;
        return;
    }
    if (ctx.ws) {
        const ws = await ctx.ws();
        session.reconnect(ctx.params.clientId, ws);
        loglevel_1.default.info(`Client ${ctx.params.clientId} reconnect to ${sessionId}`);
    }
    else {
        ctx.response.status = 400;
        return;
    }
});
router.post("/session", body_1.jsonBody, async (ctx) => {
    const options = ctx.request.body;
    const session = session_manager_1.sessionManager.new(options);
    ctx.set("Content-Type", "application/json");
    ctx.body = JSON.stringify({
        sharelink: new url_1.URL(`join/${session.id}`, ctx.options.shareLinkBase).href
    });
});
//# sourceMappingURL=controller.js.map