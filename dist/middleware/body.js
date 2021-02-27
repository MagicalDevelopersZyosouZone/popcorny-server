"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBody = void 0;
const co_body_1 = __importDefault(require("co-body"));
async function jsonBody(ctx, next) {
    if (!ctx.is("application/json"))
        ctx.throw(400);
    else {
        try {
            const body = await co_body_1.default.json(ctx);
            ctx.request.body = body;
        }
        catch {
            ctx.throw(400);
        }
        await next();
    }
}
exports.jsonBody = jsonBody;
//# sourceMappingURL=body.js.map