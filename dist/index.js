"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_easy_ws_1 = __importDefault(require("koa-easy-ws"));
const loglevel_1 = __importDefault(require("loglevel"));
const loglevel_plugin_prefix_1 = __importDefault(require("loglevel-plugin-prefix"));
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
    options = {
        ...options,
        ...require("../config")
    };
}
catch (err) {
    loglevel_1.default.warn("Failed to load config file, fallback to default configure");
}
const app = new koa_1.default();
app.context.options = options;
app.use(koa_easy_ws_1.default());
app.use(async (ctx, next) => {
    await next();
    loglevel_1.default.info(`${ctx.url}`);
});
app.use(controller_1.router.routes());
app.listen(options.port, options.hostname);
loglevel_1.default.info(`Server listen on ${options.hostname}:${options.port}`);
//# sourceMappingURL=index.js.map