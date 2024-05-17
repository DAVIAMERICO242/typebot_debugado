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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var web_1 = require("./runtimes/web");
var whatsapp_1 = require("./runtimes/whatsapp");
var prometheus_1 = require("@hono/prometheus");
var sentry_1 = require("@hono/sentry");
var env_1 = require("@typebot.io/env");
var prisma_1 = require("@typebot.io/lib/prisma");
var app = new hono_1.Hono();
app.use('*', (0, sentry_1.sentry)({
    environment: env_1.env.NODE_ENV,
    dsn: env_1.env.NEXT_PUBLIC_SENTRY_DSN,
}));
var _b = (0, prometheus_1.prometheus)(), printMetrics = _b.printMetrics, registerMetrics = _b.registerMetrics;
app.use('*', registerMetrics);
app.get('/metrics', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var honoMetrics, prismaMetrics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, printMetrics(c)];
            case 1: return [4 /*yield*/, (_a.sent()).text()];
            case 2:
                honoMetrics = _a.sent();
                return [4 /*yield*/, prisma_1.default.$metrics.prometheus()];
            case 3:
                prismaMetrics = _a.sent();
                return [2 /*return*/, c.text("".concat(honoMetrics, "\n\n").concat(prismaMetrics), 200)];
        }
    });
}); });
app.get('/ping', function (c) { return c.json({ status: 'ok' }, 200); });
app.route('/', web_1.webRuntime);
app.route('/', whatsapp_1.whatsAppRuntime);
exports.default = {
    port: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3002,
    fetch: app.fetch,
};
