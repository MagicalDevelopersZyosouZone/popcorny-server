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
const loglevel_1 = __importDefault(require("loglevel"));
const loglevel_plugin_prefix_1 = __importDefault(require("loglevel-plugin-prefix"));
const koa_1 = __importDefault(require("koa"));
const koa_easy_ws_1 = __importDefault(require("koa-easy-ws"));
const controller_1 = require("./controller");
loglevel_1.default.enableAll();
const logger = loglevel_1.default.noConflict();
loglevel_plugin_prefix_1.default.reg(logger);
loglevel_plugin_prefix_1.default.apply(logger);
let options = {
    hostname: "localhost",
    port: 5000,
    shareLinkBase: "http://localhost:5000/",
};
try {
    options = Object.assign(Object.assign({}, options), require("./config.js").default);
}
catch (_a) {
    loglevel_1.default.warn("Failed to load config file, fallback to default configure");
}
const app = new koa_1.default();
app.context.options = options;
app.use(koa_easy_ws_1.default());
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield next();
    loglevel_1.default.info(`${ctx.url}`);
}));
app.use(controller_1.router.routes());
app.listen(options.port, options.hostname);
loglevel_1.default.info(`Server listen on ${options.hostname}:${options.port}`);
//# sourceMappingURL=index.js.map