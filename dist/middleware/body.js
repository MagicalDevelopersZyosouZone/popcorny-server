"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBody = void 0;
const co_body_1 = __importDefault(require("co-body"));
function jsonBody(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.is("application/json"))
            ctx.throw(400);
        else {
            try {
                const body = yield co_body_1.default.json(ctx);
                ctx.request.body = body;
            }
            catch (_a) {
                ctx.throw(400);
            }
            yield next();
        }
    });
}
exports.jsonBody = jsonBody;
//# sourceMappingURL=body.js.map